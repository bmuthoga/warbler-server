process.env.SECRET_KEY = 'someRandomKey'
process.env.NODE_ENV = 'development'
process.env.MONGODB_URI = 'mongodb://localhost/warbler-test'
process.env.PORT = 8081

const mongoose = require('mongoose')
const nock = require('nock')

const { server } = require('..')
const winston = require('../config/winston')

// const authIntegrationTests = require('./integration/AuthSpec')
// const messagesIntegrationTests = require('./integration/AllMessagesSpec')
// const miscellaneousIntegrationTests = require('./integration/MiscellaneousSpec')
// const postUserMessagesIntegrationTests = require('./integration/PostUserMessagesSpec')
// const getUserMessagesIntegrationTests = require('./integration/GetUserMessagesSpec')
// const deleteUserMessagesIntegrationTests = require('./integration/DeleteUserMessagesSpec')

const {
  authIntegrationTests,
  messagesIntegrationTests,
  miscellaneousIntegrationTests,
  postUserMessagesIntegrationTests,
  getUserMessagesIntegrationTests,
  deleteUserMessagesIntegrationTests
} = require('/spec/integration')

const miscellaneousUnitTests = require('./unit/MiscellaneousSpec')
const authUnitTests = require('./unit/AuthSpec')
const messagesUnitTests = require('./unit/AllMessagesSpec')
const postUserMessagesUnitTests = require('./unit/PostUserMessagesSpec')
const getUserMessagesUnitTests = require('./unit/GetUserMessagesSpec')
const deleteUserMessagesUnitTests = require('./unit/DeleteUserMessagesSpec')

describe('API Tests', () => {
  describe('Integration Tests', () => {
    beforeAll(() => {
      server.close()
      server.listen(8081)
      spyOn(winston, 'info')
      spyOn(winston, 'error')
    })
  
    afterAll(done => {
      mongoose.connection.db.dropDatabase(() => {
        mongoose.connection.close()
      })
      server.close()
      done()
    })
  
    afterEach(async function (done) {
      try {
        const collections = await mongoose.connection.db.collections()
    
        for (let collection of collections) {
          await collection.deleteMany({})
        }
  
        done()
      } catch (err) {
        done()
      }
    })
  
    // miscellaneousIntegrationTests()
    // authIntegrationTests()
    // messagesIntegrationTests()
    // postUserMessagesIntegrationTests()
    // getUserMessagesIntegrationTests()
    // deleteUserMessagesIntegrationTests()
  })

  describe('Unit Tests', () => {
    afterAll(nock.restore)
    afterEach(nock.cleanAll)

    miscellaneousUnitTests()
    authUnitTests()
    messagesUnitTests()
    postUserMessagesUnitTests()
    getUserMessagesUnitTests()
    deleteUserMessagesUnitTests()
  })
})
