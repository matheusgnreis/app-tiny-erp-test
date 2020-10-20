const ecomClient = require('@ecomplus/client')
const errorHandling = require('../store-api/error-handling')
const Tiny = require('../tiny/constructor')
const parseProduct = require('./parsers/product-to-tiny')
const handleJob = require('./handle-job')

module.exports = ({ appSdk, storeId }, tinyToken, queueEntry, appData, canCreateNew) => {
  const productId = queueEntry.nextId
  return ecomClient.store({
    storeId,
    url: `/products/${productId}.json`
  })

    .then(({ data }) => {
      const product = data
      const tiny = new Tiny(tinyToken)

      const job = tiny.post('/produtos.pesquisa.php', { pesquisa: product.sku })
        .catch(err => {
          if (err.response && err.response.status === 404) {
            return {}
          }
          throw err
        })

        .then(({ produtos }) => {
          let originalTinyProduct
          if (Array.isArray(produtos)) {
            originalTinyProduct = produtos.find(({ produto }) => product.sku === String(produto.codigo))
            if (originalTinyProduct) {
              originalTinyProduct = originalTinyProduct.produto
            } else if (!canCreateNew) {
              return null
            }
          }
          const tinyProduct = parseProduct(product, originalTinyProduct, appData)
          return tinyProduct
            ? tiny.post(originalTinyProduct ? '/produto.alterar.php' : '/produto.incluir.php', {
              produto: {
                produtos: [{
                  produto: tinyProduct
                }]
              }
            })
            : null
        })
      handleJob({ appSdk, storeId }, queueEntry, job)
    })

    .catch(err => {
      errorHandling(err)
      throw err
    })
}
