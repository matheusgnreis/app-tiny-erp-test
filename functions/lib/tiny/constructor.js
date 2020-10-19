const axios = require('axios')
const xmlJs = require('xml-js')

module.exports = function (token) {
  this.request = options => {
    // https://www.tiny.com.br/ajuda/api/api2
    let data = `token=${token}&formato=JSON`
    if (options.data) {
      for (const field in options.data) {
        if (typeof options.data[field] === 'object') {
          data += `&${field}=${xmlJs.js2xml(options.data[field])}`
        }
      }
    }
    return axios({
      ...options,
      baseURL: 'https://api.tiny.com.br/api2/',
      data
    })
  }
  return this
}
