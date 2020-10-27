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

const SKIP_TRIGGER_NAME = 'SkipTrigger'
const ECHO_SUCCESS = 'SUCCESS'
const ECHO_SKIP = 'SKIP'
const ECHO_API_ERROR = 'STORE_API_ERR'

exports.post = ({ appSdk, admin }, req, res) => {
  // receiving notification from Store API
  const { storeId } = req

  /**
   * Treat E-Com Plus trigger body here
   * Ref.: https://developers.e-com.plus/docs/api/#/store/triggers/
   */
  const trigger = req.body

  const documentRef = admin.firestore().doc(`running/${storeId}`)
  documentRef.get()

    .then(documentSnapshot => new Promise(resolve => {
      let runningCount, runningKeys
      const key = trigger.resource
      if (
        documentSnapshot.exists &&
        Date.now() - documentSnapshot.updateTime.toDate().getTime() < 7000
      ) {
        runningCount = documentSnapshot.get('count')
        if (runningCount > 2) {
          throw new Error('Too much requests')
        }
        runningKeys = documentSnapshot.get('keys')
        if (runningKeys && runningKeys.includes(key)) {
          const err = new Error('Concurrent request with same key')
          err.name = SKIP_TRIGGER_NAME
          throw err
        }
      }
      if (!runningCount) {
        runningCount = 0
      }
      if (!runningKeys) {
        runningKeys = [key]
      } else {
        runningKeys.push(key)
      }

      documentRef.set({
        keys: runningKeys,
        count: runningCount + 1
      }).catch(console.error)

      setTimeout(() => resolve({
        key,
        documentRef
      }), runningCount * 7000 + 10)
    }))

    .then(({ key, documentRef }) => {
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

            const resourceId = trigger.resource_id || trigger.inserted_id
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
                          console.log(`> Starting ${action}/${queue}/${nextId}`)
                          return handler(
                            { appSdk, storeId, auth },
                            tinyToken,
                            { action, queue, nextId, key, documentRef, mustUpdateAppQueue },
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
      if (err.name === SKIP_TRIGGER_NAME) {
        // trigger ignored due to current running process
        res.status(203).send(err.message || ECHO_SKIP)
      } else {
        res.status(502)
        const { message } = err
        res.send({
          error: 'FIRESTORE_ERROR',
          message
        })
      }
    })
}
