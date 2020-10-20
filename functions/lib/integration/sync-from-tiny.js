const { firestore } = require('firebase-admin')
const ecomClient = require('@ecomplus/client')
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
              if (err.response && err.response.status === 404) {
                return ecomClient.store({
                  url: '/products.json'
                })

                  .then(({ data }) => {
                    const { result } = data
                    if (result && result.length) {
                      const documentRef = firestore().doc(`last_active_sync_product/${storeId}`)
                      return documentRef.get().then(documentSnapshot => {
                        const sortedProducts = result
                          .filter(({ sku }) => sku)
                          .sort((a, b) => a._id < b._id ? -1 : 1)
                        let product
                        if (documentSnapshot.exists) {
                          product = sortedProducts.find(({ _id }) => _id > documentSnapshot.get('_id')) ||
                            sortedProducts[0]
                        } else {
                          product = sortedProducts[0]
                        }

                        if (product) {
                          documentRef.set(product).catch(console.error)
                          return tiny.post('/produtos.pesquisa.php', { pesquisa: product.sku })
                            .then(({ produtos }) => {
                              if (Array.isArray(produtos)) {
                                const tinyProduct = produtos
                                  .find(({ produto }) => product.sku === String(produto.codigo))
                                if (tinyProduct) {
                                  return tiny.post('/produto.obter.estoque.php', { id: tinyProduct.id })
                                    .then(({ produto }) => ({ produtos: [{ produto }] }))
                                }
                              }
                            })
                            .catch(err => {
                              if (!err.response || err.response.status !== 404) {
                                const err = new Error('Unexpected response from Tiny API')
                                err.data = err.response && JSON.stringify(err.response.data)
                                console.error(err)
                              }
                            })
                        }
                      })
                    }
                  })
              }

              console.error(err)
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
                          skus.push(String(produto.codigo))
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
