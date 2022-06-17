// setup server and app options from Functions config (and mocks)

require('dotenv').config()

const pkg = {
  name: process.env.NAME,
  version: process.env.VERSION,
}

const server = {
  operator_token: process.env.SERVER_OPERATOR_TOKEN,
}

if(process.env.FUNCTION_NAME){
  server.functionName = process.env.FUNCTION_NAME
}

const functionName = server && server.functionName ? server.functionName : 'app'

module.exports = {
  functionName,
  operatorToken: server && server.operator_token,
  baseUri: (server && server.base_uri) || process.env.SERVER_BASE_URI,
  pkg: {
    ...pkg
  }
}
