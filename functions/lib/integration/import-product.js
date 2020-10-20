const { firestore } = require('firebase-admin')
const ecomClient = require('@ecomplus/client')
const Tiny = require('../tiny/constructor')
const parseProduct = require('./parsers/product-to-ecomplus')
const handleJob = require('./handle-job')

module.exports = ({ appSdk, storeId, auth }, tinyToken, queueEntry, appData, canCreateNew, isHiddenQueue) => {
  const sku = String(queueEntry.nextId)

  return firestore().collection('tiny_stock_updates')
    .where('ref', '==', `${storeId}_${tinyToken}_${sku}`)
    .limit(10)
    .get().then(querySnapshot => {
      let tinyStockUpdate
      querySnapshot.forEach(documentSnapshot => {
        tinyStockUpdate = documentSnapshot.data()
        documentSnapshot.ref.delete().catch(console.error)
      })
      return tinyStockUpdate
    })

    .then(tinyStockUpdate => {
      const dsl = {
        query: {
          bool: {
            should: [{
              term: { sku }
            }, {
              nested: {
                path: 'variations',
                query: {
                  bool: {
                    filter: [{
                      term: { 'variations.sku': sku }
                    }]
                  }
                }
              }
            }]
          }
        }
      }

      return ecomClient.search({
        url: '/items.json',
        data: dsl
      }).then(({ data }) => {
        const hit = Array.isArray(data.hits.hits) && data.hits.hits[0] && data.hits.hits[0]
        let product
        if (hit) {
          const { _id, _source } = hit
          product = { _id, ..._source }
        }
        if (product && product.variations && product.variations.length) {
          return ecomClient.store({ url: `/products/${product._id}.json` })
            .then(({ data }) => {
              const variation = data.variations.find(variation => sku === variation.sku)
              if (variation) {
                return {
                  product,
                  variationId: variation._id
                }
              } else {
                const msg = sku +
                  ' corresponde a um produto com variações, especifique o SKU da variação para importar.'
                const err = new Error(msg)
                err.isConfigError = true
                handleJob({ appSdk, storeId }, queueEntry, Promise.reject(err))
                return null
              }
            })
        }
        return { product }
      })

        .then(payload => {
          if (!payload || !payload.product) {
            return payload
          }
          const { product, variationId } = payload
          const tiny = new Tiny(tinyToken)

          if (tinyStockUpdate && !product && isHiddenQueue) {
            handleJob({ appSdk, storeId }, queueEntry, Promise.resolve(null))
            return
          }

          const handleTinyStock = ({ produto }, tinyProduct) => {
            const quantity = Number(produto.saldo)
            if (product) {
              if (!isNaN(quantity)) {
                let endpoint = `/products/${product._id}`
                if (variationId) {
                  endpoint += `/variations/${variationId}`
                }
                endpoint += '/quantity.json'
                console.log(endpoint, { quantity })
                return appSdk.apiRequest(storeId, endpoint, 'PUT', { quantity }, auth)
              }
              return null
            }

            return tiny.post('/produto.obter.php', { id: tinyProduct.id })
              .then(({ produto }) => {
                return parseProduct(produto, storeId, auth).then(product => {
                  product.quantity = quantity
                  return appSdk.apiRequest(storeId, '/products.json', 'POST', product, auth)
                })
              })
          }

          let job
          if (tinyStockUpdate && isHiddenQueue) {
            job = handleTinyStock(tinyStockUpdate)
          } else {
            job = tiny.post('/produtos.pesquisa.php', { pesquisa: sku })
              .then(({ produtos }) => {
                if (Array.isArray(produtos)) {
                  let tinyProduct = produtos.find(({ produto }) => sku === String(produto.codigo))
                  if (tinyProduct) {
                    tinyProduct = tinyProduct.produto
                    if (tinyStockUpdate) {
                      return handleTinyStock(tinyStockUpdate, tinyProduct)
                    }
                    return tiny.post('/produto.obter.estoque.php', { id: tinyProduct.id })
                      .then(tinyStock => handleTinyStock(tinyStock, tinyProduct))
                  }
                }

                const msg = `SKU ${sku} não encontrado no Tiny`
                const err = new Error(msg)
                err.isConfigError = true
                throw new Error(err)
              })
          }

          handleJob({ appSdk, storeId }, queueEntry, job)
        })
    })
}
