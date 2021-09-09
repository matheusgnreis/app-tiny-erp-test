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
      if (!order.financial_status) {
        return null
      }
      const tiny = new Tiny(tinyToken)

      const job = tiny.post('/pedidos.pesquisa.php', { numeroEcommerce: String(order.number) })
        .catch(err => {
          if (err.response && err.response.status === 404) {
            return {}
          }
          throw err
        })

        .then(({ pedidos }) => {
          const tinyStatus = parseStatus(order)
          let originalTinyOrder
          if (Array.isArray(pedidos)) {
            originalTinyOrder = pedidos.find(({ pedido }) => order.number === Number(pedido.numero_ecommerce))
            if (originalTinyOrder) {
              originalTinyOrder = originalTinyOrder.pedido
            }
          }

          if (!originalTinyOrder) {
            if (!canCreateNew) {
              return null
            }
            if (appData.approved_orders_only) {
              switch (tinyStatus) {
                case 'aberto':
                case 'cancelado':
                  console.log(`#${storeId} ${orderId} skipped with status "${tinyStatus}"`)
                  return null
              }
            }
            const tinyOrder = parseOrder(order, appData, storeId)
            console.log(`#${storeId} ${JSON.stringify(tinyOrder)}`)
            return tiny.post('/pedido.incluir.php', {
              pedido: {
                pedido: tinyOrder
              }
            })
          }

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
      if (err.response) {
        const { status } = err.response
        if (status >= 400 && status < 500) {
          const msg = `O pedido ${orderId} não existe (:${status})`
          const err = new Error(msg)
          err.isConfigError = true
          handleJob({ appSdk, storeId }, queueEntry, Promise.reject(err))
          return null
        }
      }
      errorHandling(err)
      throw err
    })
}
