const ecomClient = require('@ecomplus/client')
const Tiny = require('../tiny/constructor')
const parseProduct = require('./parsers/product-to-ecomplus')
const handleJob = require('./handle-job')

module.exports = ({ appSdk, storeId, auth }, tinyToken, queueEntry, appData) => {
  const sku = String(queueEntry.nextId)
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
    const product = Array.isArray(data.hits.hits) && data.hits.hits[0] && data.hits.hits[0]._source
    const hasVariations = Boolean(product.variations && product.variations.length)
    let variationId
    if (hasVariations) {
      const variation = product.variations.find(variation => sku === variation.sku)
      if (variation) {
        variationId = variation._id
      } else {
        const msg = `${sku} corresponse a um produto com variações, especifique o SKU da variação para importar.`
        const err = new Error(msg)
        err.isConfigError = true
        handleJob({ appSdk, storeId }, queueEntry, Promise.reject(err))
      }
    }
    const tiny = new Tiny(tinyToken)

    const job = tiny.post('/produtos.pesquisa.php', { pesquisa: sku })
      .then(({ produtos }) => {
        if (Array.isArray(produtos)) {
          const tinyProduct = produtos.find(({ produto }) => sku === String(produto.codigo))
          if (tinyProduct) {
            return tiny.post('/produto.obter.estoque.php', { id: tinyProduct.id })
              .then(({ produto }) => {
                const quantity = Number(produto.saldo)
                if (product) {
                  if (!isNaN(quantity)) {
                    let endpoint = `/products/${product._id}`
                    if (variationId) {
                      endpoint += `/variations/${variationId}`
                    }
                    endpoint += '/quantity.json'
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
              })
          }
        }

        const msg = `SKU ${sku} não encontrado no Tiny`
        const err = new Error(msg)
        err.isConfigError = true
        throw new Error(err)
      })
    handleJob({ appSdk, storeId }, queueEntry, job)
  })
}
