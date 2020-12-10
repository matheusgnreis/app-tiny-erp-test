const getAppData = require('../../lib/store-api/get-app-data')
const updateAppData = require('../../lib/store-api/update-app-data')

exports.get = ({ appSdk, admin }, req, res) => {
  return res.sendStatus(200)
}

exports.post = ({ appSdk, admin }, req, res) => {
  const tinyToken = req.query.token
  const storeId = parseInt(req.query.store_id, 10)

  if (storeId > 100 && typeof tinyToken === 'string' && tinyToken && req.body) {
    const { dados } = req.body
    if (dados) {
      /*
      TODO: check Tiny server IPs
      const clientIp = req.get('x-forwarded-for') || req.connection.remoteAddress
      */
      return appSdk.getAuth(storeId).then(auth => {
        return getAppData({ appSdk, storeId, auth })

          .then(appData => {
            if (appData.tiny_api_token !== tinyToken) {
              return res.sendStatus(401)
            }

            const { idVendaTiny, idProduto } = dados
            if (idVendaTiny) {
              let orderNumbers = appData.___importation && appData.___importation.order_numbers
              if (!Array.isArray(orderNumbers)) {
                orderNumbers = []
              }
              const orderNumber = `id:${idVendaTiny}`

              if (!orderNumbers.includes(orderNumber)) {
                orderNumbers.push(orderNumber)
                console.log(`> #${storeId} order numbers: ${JSON.stringify(orderNumbers)}`)
                return updateAppData({ appSdk, storeId }, {
                  ___importation: {
                    ...appData.___importation,
                    order_numbers: orderNumbers
                  }
                })
              }
            }

            if (idProduto && dados.sku) {
              let skus = appData.___importation && appData.___importation.skus
              if (!Array.isArray(skus)) {
                skus = []
              }
              const sku = dados.skuMapeamento || dados.sku

              if (!skus.includes(sku)) {
                return admin.firestore().collection('tiny_stock_updates').add({
                  ref: `${storeId}_${tinyToken}_${sku}`,
                  produto: {
                    ...dados,
                    id: idProduto,
                    codigo: dados.sku
                  }
                }).then(() => {
                  skus.push(sku)
                  console.log(`> #${storeId} SKUs: ${JSON.stringify(skus)}`)
                  return updateAppData({ appSdk, storeId }, {
                    ___importation: {
                      ...appData.___importation,
                      skus
                    }
                  })
                })
              }
            }
            return null
          })

          .then(payload => res.sendStatus(200))
          .catch(err => {
            console.error(err)
            res.sendStatus(502)
          })
      })
    } else {
      return res.sendStatus(400)
    }
  }

  res.sendStatus(403)
}
