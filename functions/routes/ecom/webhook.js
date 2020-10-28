// read configured E-Com Plus app data
const getAppData = require('./../../lib/store-api/get-app-data')

// async integration handlers
const integrationHandlers = {
  exportation: {
    product_ids: require('./../../lib/integration/export-product'),
    order_ids: require('./../../lib/integration/export-order')
  },
  importation: {
    skus: require('./../../lib/integration/import-product'),
    order_numbers: require('./../../lib/integration/import-order')
  }
}
const handleJob = require('./../../lib/integration/handle-job')

const SKIP_TRIGGER_NAME = 'SkipTrigger'
const ECHO_SUCCESS = 'SUCCESS'
const ECHO_SKIP = 'SKIP'
const ECHO_API_ERROR = 'STORE_API_ERR'
const runnnig = {}

exports.post = ({ appSdk, admin }, req, res) => {
  // receiving notification from Store API
  const { storeId } = req

  /**
   * Treat E-Com Plus trigger body here
   * Ref.: https://developers.e-com.plus/docs/api/#/store/triggers/
   */
  const trigger = req.body
  const resourceId = trigger.resource_id || trigger.inserted_id

  if (runnnig[resourceId]) {
    runnnig[resourceId]++
    const count = runnnig[resourceId]
    return setTimeout(() => {
      res.sendStatus(count === runnnig[resourceId] ? 503 : 204)
    }, 500)
  }
  runnnig[resourceId] = 1

  const documentRef = admin.firestore().doc(`running/${storeId}`)
  documentRef.get()

    .then(documentSnapshot => new Promise((resolve, reject) => {
      let runningCount, isRunningKey
      const key = `${trigger.resource}_${resourceId}`
      const validateSnapshot = documentSnapshot => {
        return documentSnapshot.exists &&
          Date.now() - documentSnapshot.updateTime.toDate().getTime() < 10000
      }

      const proceed = () => {
        if (!runningCount) {
          runningCount = 0
        }
        documentRef.set({
          count: runningCount + 1
        }, {
          merge: true
        }).catch(console.error)

        const uncountRequest = (count = 0, isHandling) => {
          delete runnnig[resourceId]
          const data = { count }
          if (isHandling === true) {
            data[key] = true
          }
          documentRef.set(data, { merge: true }).catch(console.error)
        }

        const handleReject = (err, count = runningCount) => {
          uncountRequest(count)
          reject(err)
        }

        const proceed = ({ runningCount, isRunningKey }) => {
          if (isRunningKey) {
            const err = new Error('Concurrent request with same key')
            err.name = SKIP_TRIGGER_NAME
            handleReject(err, runningCount)
          } else {
            resolve({
              documentRef,
              key,
              runningCount,
              uncountRequest
            })
          }
        }

        if (runningCount > 0) {
          setTimeout(() => {
            documentRef.get().then(documentSnapshot => {
              const proceedData = validateSnapshot(documentSnapshot)
                ? {
                  runningCount: documentSnapshot.get('count') || 0,
                  isRunningKey: documentSnapshot.get(key)
                }
                : {
                  runningCount: 0
                }
              proceed(proceedData)
            }).catch(handleReject)
          }, runningCount * 1500)
        } else {
          proceed({ runningCount, isRunningKey })
        }
      }

      if (validateSnapshot(documentSnapshot)) {
        if (documentSnapshot.get('stop') === trigger.resource) {
          const err = new Error('Stop for this trigger resource')
          err.name = SKIP_TRIGGER_NAME
          return reject(err)
        }
        runningCount = documentSnapshot.get('count')
        isRunningKey = documentSnapshot.get(key)
        if (runningCount > 3) {
          const err = new Error('Too much requests')
          if (isRunningKey) {
            err.name = SKIP_TRIGGER_NAME
          }
          return reject(err)
        }
      } else if (documentSnapshot.exists) {
        return documentRef.delete()
          .catch(console.error)
          .finally(proceed)
      }
      proceed()
    }))

    .then(({ documentRef, key, runningCount, uncountRequest }) => {
      // get app configured options
      appSdk.getAuth(storeId).then(auth => {
        return getAppData({ appSdk, storeId, auth })

          .then(appData => {
            if (
              Array.isArray(appData.ignore_triggers) &&
              appData.ignore_triggers.indexOf(trigger.resource) > -1
            ) {
              // ignore current trigger
              const err = new Error()
              err.name = SKIP_TRIGGER_NAME
              throw err
            }

            /* DO YOUR CUSTOM STUFF HERE */
            console.log(`> Webhook #${storeId} ${resourceId} [${trigger.resource}]`)

            const tinyToken = appData.tiny_api_token
            if (typeof tinyToken === 'string' && tinyToken) {
              let integrationConfig
              let canCreateNew = false

              switch (trigger.resource) {
                case 'applications':
                  integrationConfig = appData
                  canCreateNew = true
                  break
                case 'products':
                  if (trigger.body) {
                    if (trigger.action === 'create') {
                      if (!appData.new_products) {
                        break
                      }
                      canCreateNew = true
                    } else if (!trigger.body.price || !appData.update_price) {
                      break
                    }
                    integrationConfig = {
                      _exportation: {
                        product_ids: [resourceId]
                      }
                    }
                  }
                  break
                case 'orders':
                  if (trigger.body) {
                    canCreateNew = Boolean(appData.new_orders)
                    integrationConfig = {
                      _exportation: {
                        order_ids: [resourceId]
                      }
                    }
                  }
                  break
              }

              if (integrationConfig) {
                const actions = Object.keys(integrationHandlers)
                actions.forEach(action => {
                  for (let i = 1; i <= 3; i++) {
                    actions.push(`${('_'.repeat(i))}${action}`)
                  }
                })
                for (let i = 0; i < actions.length; i++) {
                  const action = actions[i]
                  const actionQueues = integrationConfig[action]

                  if (typeof actionQueues === 'object' && actionQueues) {
                    for (const queue in actionQueues) {
                      const ids = actionQueues[queue]
                      if (Array.isArray(ids) && ids.length) {
                        const isHiddenQueue = action.charAt(0) === '_'
                        const mustUpdateAppQueue = trigger.resource === 'applications'
                        const handler = integrationHandlers[action.replace(/^_+/, '')][queue.toLowerCase()]
                        const nextId = ids[0]

                        if (
                          typeof nextId === 'string' &&
                          nextId.length &&
                          handler
                        ) {
                          const debugFlag = `#${storeId} ${action}/${queue}/${nextId}`
                          console.log(`> Starting ${debugFlag}`)
                          const queueEntry = { action, queue, nextId, key, documentRef, mustUpdateAppQueue }
                          uncountRequest(runningCount, true)

                          const resetFallback = setTimeout(() => {
                            console.log(`<<TIMEOUT>> ${debugFlag}`)
                            unsubscribe()
                            handleJob({ appSdk, storeId }, queueEntry, Promise.resolve(null))
                          }, 30000)

                          let unsubscribe = documentRef.onSnapshot(documentSnapshot => {
                            if (!documentSnapshot.exists || !documentSnapshot.get(key)) {
                              if (unsubscribe) {
                                unsubscribe()
                                unsubscribe = null
                              }
                              clearTimeout(resetFallback)
                            }
                          }, err => {
                            console.log(`Encountered error: ${err}`)
                          })

                          return handler(
                            { appSdk, storeId, auth },
                            tinyToken,
                            queueEntry,
                            appData,
                            canCreateNew,
                            isHiddenQueue
                          )
                            .then(() => ({ appData, action, queue }))
                        }
                      }
                    }
                  }
                }
              }
            }

            // console.log('> Skip webhook:', JSON.stringify(appData))
            uncountRequest(runningCount)
            // nothing to do
            return {}
          })

          .then(({ appData, action, queue }) => {
            if (appData) {
              if (appData[action] && Array.isArray(appData[action][queue])) {
                res.status(202)
              } else {
                res.status(201)
              }
              res.send(`> Processed \`${action}.${queue}\``)
            } else {
              res.send(ECHO_SUCCESS)
            }
          })
      })

        .catch(err => {
          if (err.name === SKIP_TRIGGER_NAME) {
            // trigger ignored by app configuration
            res.send(ECHO_SKIP)
          } else {
            if (err.response) {
              const error = new Error('Webhook process request error')
              error.config = JSON.stringify(err.config)
              error.response = JSON.stringify({
                status: err.response.status,
                data: err.response.data
              })
              console.error(error)
            } else {
              console.error(err)
            }
            // request to Store API with error response
            // return error status code
            res.status(500)
            const { message } = err
            res.send({
              error: ECHO_API_ERROR,
              message
            })
          }
        })
    })

    .catch(err => {
      delete runnnig[resourceId]
      if (err.name === SKIP_TRIGGER_NAME) {
        // trigger ignored due to current running process
        res.status(203).send(err.message || ECHO_SKIP)
      } else {
        setTimeout(() => {
          res.status(502)
          const { message } = err
          res.send({
            error: 'FIRESTORE_ERROR',
            message
          })
        }, 250)
      }
    })
}
