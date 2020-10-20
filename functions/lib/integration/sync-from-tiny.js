const { firestore } = require('firebase-admin')
const { setup } = require('@ecomplus/application-sdk')
const getAppData = require('../store-api/get-app-data')
const updateAppData = require('../store-api/update-app-data')
const Tiny = require('../tiny/constructor')
const formatDate = require('./helpers/format-tiny-date')

const listStoreIds = () => {
  const storeIds = []
  const date = new Date()
  date.setHours(date.getHours() - 24)

  return firestore()
    .collection('ecomplus_app_auth')
    .where('updated_at', '>', firestore.Timestamp.fromDate(date))
    .get().then(querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {
        const storeId = documentSnapshot.get('store_id')
        if (storeIds.indexOf(storeId) === -1) {
          storeIds.push(storeId)
        }
      })
      return storeIds
    })
}

const fetchTinyStockUpdates = ({ appSdk, storeId }) => {
  return new Promise((resolve, reject) => {
    getAppData({ appSdk, storeId })
      .then(appData => {
        resolve()

        const tinyToken = appData.tiny_api_token
        if (typeof tinyToken === 'string' && tinyToken && appData.update_quantity) {
          const tiny = new Tiny(tinyToken)
          const starDate = new Date()
          starDate.setDate(starDate.getDate() - 1)

          tiny.post('/lista.atualizacoes.estoque', { dataAlteracao: formatDate(starDate) })
            .catch(err => {
              if (!err.response || err.response.status !== 404) {
                console.error(err)
              }
              return {}
            })

            .then(payload => {
              if (!payload) {
                return
              }
              const { produtos } = payload
              if (produtos && produtos.length) {
                let skus = appData.importation && appData.importation.__skus
                if (!Array.isArray(skus)) {
                  skus = []
                }
                const promises = []
                produtos.forEach(({ produto }) => {
                  if (produto.codigo) {
                    promises.push(new Promise(resolve => {
                      firestore().collection('tiny_stock_updates').add({
                        ref: `${storeId}_${tinyToken}_${produto.codigo}`,
                        produto
                      })
                        .then(() => {
                          const sku = String(produto.codigo)
                          if (!skus.includes(sku)) {
                            skus.push(sku)
                          }
                          resolve()
                        })
                        .catch(console.error)
                    }))
                  }
                })

                if (promises.length) {
                  return Promise.all(promises).then(() => {
                    console.log(`> #${storeId} SKUs: ${JSON.stringify(skus)}`)
                    return updateAppData({ appSdk, storeId }, {
                      importation: {
                        __skus: skus
                      }
                    })
                  })
                } else {
                  return Promise.resolve()
                }
              }
            })

            .catch(console.error)
        }
      })
      .catch(reject)
  })
}

module.exports = context => setup(null, true, firestore())
  .then(appSdk => {
    return listStoreIds().then(storeIds => {
      const runAllStores = fn => storeIds
        .sort(() => Math.random() - Math.random())
        .map(storeId => fn({ appSdk, storeId }))
      return Promise.all(runAllStores(fetchTinyStockUpdates))
    })
  })
  .catch(console.error)
