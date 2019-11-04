process.env.SECRET_KEY = 'someRandomKey'
process.env.NODE_ENV = 'development'
process.env.MONGODB_URI = 'mongodb://localhost/warbler-test'
process.env.PORT = 8081

const mongoose = require('mongoose')
const { server } = require('../../')
const winston = require('../../config/winston')
const authTests = require('./AuthSpec')
const messagesTests = require('./AllMessagesSpec')
const miscellaneousTests = require('./MiscellaneousSpec')
const userMessagesTests = require('./UserMessagesSpec')

describe('API Tests', () => {
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

  miscellaneousTests()
  authTests()
  messagesTests()
  userMessagesTests()
})
