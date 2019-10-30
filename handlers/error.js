const winston = require('winston')

function errorHandler(error, request, response, next) {
  // adding winston logging
  winston.error(`${error.status || 500} - ${error.message} - ${request.originalUrl} - ${request.method} - ${request.ip}`)  

  return response.status(error.status || 500).json({
    error: {
      message: error.message || 'Oops! Something went wrong.'
    }
  })
}

module.exports = errorHandler
