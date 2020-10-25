const errorHandling = require('../store-api/error-handling')
const Tiny = require('../tiny/constructor')
const parseOrder = require('./parsers/order-to-tiny/')
const parseStatus = require('./parsers/order-to-tiny/status')
const handleJob = require('./handle-job')

module.exports = ({ appSdk, storeId, auth }, tinyToken, queueEntry, appData, canCreateNew) => {
  const orderId = queueEntry.nextId

  return appSdk.apiRequest(storeId, `/orders/${orderId}.json`, 'GET', null, auth)
    .then(({ response }) => {
      const order = response.data
      const tiny = new Tiny(tinyToken)

      const job = tiny.post('/pedidos.pesquisa.php', { numeroEcommerce: String(order.number) })
        .catch(err => {
          if (err.response && err.response.status === 404) {
            return {}
          }
          throw err
        })

        .then(({ pedidos }) => {
          let originalTinyOrder
          if (Array.isArray(pedidos)) {
            originalTinyOrder = pedidos.find(({ pedido }) => order.number === Number(pedido.numero_ecommerce))
            if (originalTinyOrder) {
              originalTinyOrder = originalTinyOrder.pedido
            } else if (!canCreateNew) {
              return null
            }
          }
          const tinyOrder = parseOrder(order, appData, storeId)
          if (!originalTinyOrder) {
            return tiny.post('/pedido.incluir.php', {
              pedido: {
                pedido: tinyOrder
              }
            })
          }

          const tinyStatus = parseStatus(order)
          if (tinyStatus) {
            return tiny.post('/pedido.alterar.situacao', {
              id: originalTinyOrder.id,
              situacao: tinyStatus
            })
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
