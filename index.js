require('dotenv').config()
const express = require('express')
const http = require('http')
const helmet = require('helmet')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const winston = require('./config/winston')
const errorHandler = require('./handlers/error')
const authRoutes = require('./routes/auth')
const messageRoutes = require('./routes/message')
const messagesRoutes = require('./routes/messages')
const { loginRequired, ensureCorrectUser } = require('./middleware/auth')

const PORT = process.env.PORT || 8081
const app = express()
const server = http.createServer(app)

/**
* Event listener for HTTP server "listening" event.
 *
 * @param {Object} server the http server instance
 *
 * @returns {null} server process is continous here, so no returns
 */
function onListening (server) {
  // console.log('server', server);
  const addr = server.address()
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`

  winston.info(`🚧 Server is listening on ${bind}`)
}

/**
 * Event listener for HTTP server "error" event.
 * @param {Error} error an error message
 * @returns {null} error already logged exits process
 */
function onError (error) {
  return winston.error(error.message)
}

app.use(helmet())
app.use(express.urlencoded({ extended: false }))

// Request Logging Middleware
app.use((req, res, next) => {
  return morgan('combined', {
    immediate: true,
    stream: {
      write: msg => winston.info(msg.trim())
    }
  })(req, res, next)
})

app.use(cors())
app.use(bodyParser.json())

app.use('/api/auth', authRoutes)

app.use('/api/users/:id/messages',
  loginRequired,
  ensureCorrectUser,
  messageRoutes
)

app.use('/api/messages',
  loginRequired,
  messagesRoutes
)

app.use((req, res, next) => {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use(errorHandler)

server.on('listening', onListening.bind(null, server))
  .on('error', onError)

server.listen(PORT)

module.exports = server
