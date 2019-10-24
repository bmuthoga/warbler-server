const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') {
  mongoose.set('debug', true)
}
mongoose.Promise = Promise
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/warbler', {
  keepAlive: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})

module.exports.User = require('./user')
module.exports.Message = require('./message')
