const rp = require('request-promise')

const BASE_URL = 'http://localhost:8081'

function apiCall(obj) {
  const options = {
    method: obj.method || 'GET',
    uri: `${BASE_URL}${obj.apiEndpoint || ''}`,
    headers: obj.headers,
    body: obj.body,
    json: obj.json,
    resolveWithFullResponse: obj.resolveWithFullResponse
  }
  
  return rp(options)
}

module.exports = apiCall
