const axios = require('axios')
const xmlJs = require('xml-js')

module.exports = function (token) {
  this.post = (url, body, options) => {
    // https://www.tiny.com.br/ajuda/api/api2
    let data = `token=${token}&formato=JSON`
    if (body) {
      for (const field in body) {
        if (body[field]) {
          switch (typeof body[field]) {
            case 'object':
              data += `&${field}=${xmlJs.js2xml(body[field])}`
              break
            case 'string':
            case 'number':
              data += `&${field}=${body[field]}`
          }
        }
      }
    }

    return axios.post(url, data, {
      baseURL: 'https://api.tiny.com.br/api2/',
      timeout: 30000,
      ...options
    })
      .then(response => {
        const { retorno } = response.data
        if (retorno.status === 'Erro') {
          const err = new Error('Tiny error response')
          if (retorno.codigo_erro <= 2) {
            response.status = 401
          } else if (retorno.codigo_erro === 6) {
            response.status = 503
          }
          err.response = response
          err.config = response.config
          err.request = response.request
          throw err
        }
        return retorno
      })
  }

  return this
}
