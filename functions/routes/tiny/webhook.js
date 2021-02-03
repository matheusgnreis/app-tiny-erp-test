const getAppData = require('../../lib/store-api/get-app-data')
const updateAppData = require('../../lib/store-api/update-app-data')

exports.get = ({ appSdk, admin }, req, res) => {
  return res.sendStatus(200)
}

exports.post = ({ appSdk, admin }, req, res) => {
  const tinyToken = req.query.token
  const storeId = parseInt(req.query.store_id, 10)

  if (storeId > 100 && typeof tinyToken === 'string' && tinyToken && req.body) {
    const { dados, tipo } = req.body
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

            if (dados.idVendaTiny) {
              let orderNumbers = appData.___importation && appData.___importation.order_numbers
              if (!Array.isArray(orderNumbers)) {
                orderNumbers = []
              }
              const orderNumber = `id:${dados.idVendaTiny}`

              if (!orderNumbers.includes(orderNumber)) {
                orderNumbers.push(orderNumber)
                console.log(`> #${storeId} order numbers: ${JSON.stringify(orderNumbers)}`)
                return updateAppData({ appSdk, storeId, auth }, {
                  ___importation: {
                    ...appData.___importation,
                    order_numbers: orderNumbers
                  }
                })
              }
            }

            if (tipo === 'produto' || tipo === 'estoque') {
              if ((dados.id || dados.idProduto) && (dados.codigo || dados.sku)) {
                let skus = appData.___importation && appData.___importation.skus
                if (!Array.isArray(skus)) {
                  skus = []
                }
                const sku = String(dados.skuMapeamento || dados.sku || dados.codigo)

                if (!skus.includes(sku)) {
                  return admin.firestore().collection('tiny_stock_updates').add({
                    storeId,
                    ref: `${storeId}_${tinyToken}_${sku}`,
                    produto: {
                      id: dados.idProduto,
                      codigo: dados.sku,
                      ...dados
                    }
                  }).then(() => {
                    skus.push(sku)
                    console.log(`> #${storeId} SKUs: ${JSON.stringify(skus)}`)
                    return updateAppData({ appSdk, storeId, auth }, {
                      ___importation: {
                        ...appData.___importation,
                        skus
                      }
                    })
                  })
                }
              }
            }
            return null
          })

          .then(payload => {
            if (tipo === 'produto') {
              const mapeamentos = []
              const parseTinyItem = tinyItem => {
                if (tinyItem) {
                  const { idMapeamento, id, codigo, sku } = tinyItem
                  mapeamentos.push({
                    mapeamento: {
                      idMapeamento: parseInt(idMapeamento || id, 10),
                      skuMapeamento: codigo || sku
                    }
                  })
                }
              }
              parseTinyItem(dados)
              if (Array.isArray(dados.variacoes)) {
                dados.variacoes.forEach(variacao => {
                  parseTinyItem(variacao.id ? variacao : variacao.variacao)
                })
              }
              // console.log(JSON.stringify({ mapeamentos }))
              return res.status(200).send({ mapeamentos })
            }
            return res.sendStatus(200)
          })
      })

        .catch(err => {
          err.storeId = storeId
          err.tinyToken = tinyToken
          console.error(err)
          res.sendStatus(502)
        })
    } else {
      return res.sendStatus(400)
    }
  }

  res.sendStatus(403)
}
