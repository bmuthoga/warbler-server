process.env.SECRET_KEY = 'someRandomKey'
process.env.NODE_ENV = 'development'
process.env.MONGODB_URI = 'mongodb://localhost/warbler-test'

const mongoose = require('mongoose')
const server = require('../../')
const authTests = require('./AuthSpec')
const messagesTests = require('./AllMessagesSpec')
const miscellaneousTests = require('./MiscellaneousSpec')
const userMessagesTests = require('./UserMessagesSpec')

describe('API Tests', () => {
  afterAll(done => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close()
    })
    done()
  })

  afterEach(async function () {
    const collections = await mongoose.connection.db.collections()
  
    for (let collection of collections) {
      await collection.deleteMany({})
    }
  })

  miscellaneousTests()
  authTests()
  messagesTests()
  userMessagesTests()
})
