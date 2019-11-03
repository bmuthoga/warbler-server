const appRoot = require('app-root-path')
const winston = require('winston')

const options = {
  file: {
    level: 'info',
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: true
  },
  console: {
    level: process.env === 'development' ? 'debug' : 'info',
    handleExceptions: true,
    humanReadableUnhandledException: true,
    json: false,
    colorize: true,
    prettyPrint: true,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
      winston.format.timestamp(),
      winston.format.align(),
      winston.format.printf(info => {
        const {
          timestamp, level, message, ...args
        } = info

        const ts = timestamp.slice(0, 19).replace('T', ' ')
        return `${ts} [${level}]: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`
      })
    )
  }
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      ...options.file,
      filename: `${appRoot}/logs/error.log`,
      level: 'error'
    }),
    new winston.transports.File({
      ...options.file,
      filename: `${appRoot}/logs/combined.log`
    }),
    new winston.transports.Console(options.console)
  ],
  exceptionHandlers: [
    new winston.transports.File({
      ...options.file,
      filename: `${appRoot}/logs/exceptions.log`
    })
  ],
  exitOnError: false
})

module.exports = logger
