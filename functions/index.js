#!/usr/bin/env node

const { functionName, operatorToken, baseUri } = require('./__env')

const path = require('path')
const recursiveReadDir = require('./lib/recursive-read-dir')

const handleEventTiny = require('./lib/pubsub/webhook-tiny')

// Firebase SDKs to setup cloud functions and access Firestore database
const admin = require('firebase-admin')
const functions = require('firebase-functions')
const { onRequest }  = require('firebase-functions/v2/https')
admin.initializeApp()

// web server with Express
const express = require('express')
const bodyParser = require('body-parser')
const server = express()
const router = express.Router()
const routes = './routes'

// enable/disable some E-Com common routes based on configuration
const { app, procedures } = require('./ecom.config')

// handle app authentication to Store API
// https://github.com/ecomplus/application-sdk
const { ecomServerIps, setup } = require('@ecomplus/application-sdk')

server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json())

server.use((req, res, next) => {
  if (req.url.startsWith('/ecom/')) {
    // get E-Com Plus Store ID from request header
    req.storeId = parseInt(req.get('x-store-id') || req.query.store_id, 10)
    if (req.url.startsWith('/ecom/modules/')) {
      // request from Mods API
      // https://github.com/ecomclub/modules-api
      const { body } = req
      if (typeof body !== 'object' || body === null || !body.params || !body.application) {
        return res.status(406).send('Request not comming from Mods API? Invalid body')
      }
    }

    if (process.env.NODE_ENV !== 'development') {
      // check for operator token
      if (operatorToken !== req.get('x-operator-token')) {
        // last check for IP address from E-Com Plus servers
        const clientIp = req.get('x-forwarded-for') || req.connection.remoteAddress
        if (ecomServerIps.indexOf(clientIp) === -1) {
          return res.status(403).send('Who are you? Unauthorized IP address')
        }
      }
    }
  }

  // pass to the endpoint handler
  // next Express middleware
  next()
})

router.get('/', (req, res) => {
  // pretty print application body
  server.set('json spaces', 2)
  require(`${routes}/`)(req, res)
})

router.get('/_me', (req, res) => {
  server.set('json spaces', 2)
  res.send({
    host: req.get('host'),
    baseUri
  })
})

const prepareAppSdk = () => {
  // debug ecomAuth processes and ensure enable token updates by default
  process.env.ECOM_AUTH_DEBUG = 'true'
  process.env.ECOM_AUTH_UPDATE = 'enabled'
  // setup ecomAuth client with Firestore instance
  return setup(null, true, admin.firestore())
}

// base routes for E-Com Plus Store API
const routesDir = path.join(__dirname, routes)
recursiveReadDir(routesDir).filter(filepath => filepath.endsWith('.js')).forEach(filepath => {
  // set filename eg.: '/ecom/auth-callback'
  let filename = filepath.replace(routesDir, '').replace(/\.js$/i, '')
  if (path.sep !== '/') {
    filename = filename.split(path.sep).join('/')
  }
  if (filename.charAt(0) !== '/') {
    filename = `/${filename}`
  }

  // ignore some routes
  switch (filename) {
    case '/index':
      // home already set
      return
    case '/ecom/webhook':
      // don't need webhook endpoint if no procedures configured
      if (!procedures.length) {
        return
      }
      break
    default:
      if (filename.startsWith('/ecom/modules/')) {
        // check if module is enabled
        const modName = filename.split('/').pop().replace(/-/g, '_')
        if (!app.modules || !app.modules[modName] || app.modules[modName].enabled === false) {
          return
        }
      }
  }

  // expecting named exports with HTTP methods
  const methods = require(`${routes}${filename}`)
  for (const method in methods) {
    const middleware = methods[method]
    if (middleware) {
      router[method](filename, (req, res) => {
        console.log(`${method} ${filename}`)
        prepareAppSdk().then(appSdk => {
          middleware({ appSdk, admin }, req, res)
        }).catch(err => {
          console.error(err)
          res.status(500)
          res.send({
            error: 'SETUP',
            message: 'Can\'t setup `ecomAuth`, check Firebase console registers'
          })
        })
      })
    }
  }
})

server.use(router)
server.use(express.static('public'))

exports[functionName] = functions.https.onRequest(server)
exports[`${functionName}v2`] = onRequest({ memory: '512MiB' }, server)
console.log(`-- Starting '${app.title}' E-Com Plus app with Function '${functionName}'`)

// schedule update tokens job
const cron = '20 */3 * * *'
exports.updateTokens = functions.pubsub.schedule(cron).onRun(() => {
  return prepareAppSdk().then(appSdk => {
    return appSdk.updateTokens()
  })
})
console.log(`-- Sheduled update E-Com Plus tokens '${cron}'`)

// schedule sync from Tiny API to local Firestore and Store API
const syncFromTiny = require('./lib/integration/sync-from-tiny')
const syncCron = 'every 3 mins'
exports.scheduledSync = functions.pubsub.schedule(syncCron).onRun(syncFromTiny)
console.log(`-- Sheduled active sync from Tiny API '${syncCron}'`)

// delete old stored Tiny order states
const clearTinyStates = require('./lib/integration/clear-tiny-states')
const clearStatesCron = '08 09 * * *'
exports.scheduledClear = functions.pubsub.schedule(clearStatesCron).onRun(clearTinyStates)
console.log(`-- Sheduled clearing Tiny stored states '${clearStatesCron}'`)

exports.onTinyEvents = require('./lib/pubsub/create-topic')
  .createEventsFunction('tiny', handleEventTiny)
