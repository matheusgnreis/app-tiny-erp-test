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
        .then(({ produtos }) => {
          let tinyProduct
          if (Array.isArray(produtos)) {
            tinyProduct = produtos.find(({ codigo }) => product.sku === String(codigo))
            if (!tinyProduct && !canCreateNew) {
              return null
            }
          }
          const tinyBody = parseProduct(product, tinyProduct, appData)
          return tinyBody
            ? tiny.post(tinyProduct ? '/produto.alterar.php' : '/produto.incluir.php', tinyBody)
            : null
        })
      handleJob({ appSdk, storeId }, queueEntry, job)
    })

    .catch(err => {
      errorHandling(err)
      throw err
    })
}
