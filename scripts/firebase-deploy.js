require('dotenv').config()
const path = require('path')
const fs = require('fs')

const {
  FIREBASE_TOKEN,
  SERVER_OPERATOR_TOKEN,
  SERVER_BASE_URI
} = process.env

require('./scripts-minification')

const { name, version } = require('../package.json')
const { project, baseUri } = require('./_constants')
const client = require('firebase-tools')

const config = [
  `pkg.version=${version}`,
  `pkg.name=${name}`,
  `server.operator_token=${SERVER_OPERATOR_TOKEN}`
]


const env = [
  `NAME="${name}"`,
  `VERSION="${version}"`,
  `SERVER_OPERATOR_TOKEN="${SERVER_OPERATOR_TOKEN}"`
]

if (SERVER_BASE_URI) {
  // config.push(`server.base_uri=${SERVER_BASE_URI}`)
  env.push(`SERVER_BASE_URI="${SERVER_BASE_URI}"`)
}


const envDir = path.resolve(__dirname, '../functions')
fs.writeFileSync(`${envDir}/.env`, env.join('\n'), 'utf-8')


console.log('Config OK')
client.deploy({
  project,
  only: 'functions',
  token: FIREBASE_TOKEN,
  force: true
})

  .then(() => {
    console.log(
      '\x1b[32m%s\x1b[0m',
      `\nDeployed with success to Firebase project '${project}'`
    )
    console.log(
      '\x1b[35m%s\x1b[0m',
      `\nBase URI: ${baseUri}`
    )
    console.log()
  })

  .catch(err => {
    console.error(err)
    process.exit(1)
  })
