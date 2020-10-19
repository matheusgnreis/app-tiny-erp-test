const qs = require('qs')
const axios = require('axios')

module.exports = function (token) {
  this.request = options => {
    // https://www.tiny.com.br/ajuda/api/api2
    const body = {
      token,
      formato: 'JSON'
    }
    if (options.data) {
      Object.assign(body, options.data)
    }
    return axios({
      ...options,
      baseURL: 'https://api.tiny.com.br/api2/',
      data: qs.stringify(body)
    })
  }
  return this
}
