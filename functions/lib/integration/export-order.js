const ecomClient = require('@ecomplus/client')
const errorHandling = require('../store-api/error-handling')
const Tiny = require('../tiny/constructor')
const parseOrder = require('./parsers/order-to-tiny')
const handleJob = require('./handle-job')

module.exports = ({ appSdk, storeId }, tinyToken, queueEntry, appData, canCreateNew) => {
  const orderId = queueEntry.nextId
  return ecomClient.store({
    storeId,
    url: `/orders/${orderId}.json`
  })

    .then(({ data }) => {
      const order = data
      const tiny = new Tiny(tinyToken)

      const job = tiny.post('/pedidos.pesquisa.php', { numeroEcommerce: String(order.number) })
        .then(({ pedidos }) => {
          let tinyOrder
          if (Array.isArray(pedidos)) {
            tinyOrder = pedidos.find(tinyOrder => order.number === Number(tinyOrder.numero_ecommerce))
            if (!tinyOrder && !canCreateNew) {
              return null
            }
          }
          const tinyBody = parseOrder(order, tinyOrder, appData)
          if (!tinyOrder) {
            return tiny.post('/pedido.incluir.php', tinyBody)
          }
          return null
        })
      handleJob({ appSdk, storeId }, queueEntry, job)
    })

    .catch(err => {
      errorHandling(err)
      throw err
    })
}
