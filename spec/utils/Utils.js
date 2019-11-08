const rp = require('request-promise')
const nock = require('nock')

const mockApi = nock('http://localhost:8081')
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

function generateRandomString() {
  return (
    Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  )
}

module.exports = {
  apiCall,
  mockApi,
  generateRandomString
}
