const apiCall = require('./utils/Utils')
const winston = require('../../config/winston')
const { onError } = require('../../')

module.exports = () => {
  describe('Miscellaneous', () => {
    it('should successfully start the server', () => {
      expect(winston.info).toHaveBeenCalled()
      expect(winston.info).toHaveBeenCalledWith(`🚧 Server is listening on port 8081`)
    })

    it('should log an error that occurs with the server', () => {
      const error = new Error(`Server could not listen on port 8081`)
      onError(error)
      expect(winston.error).toHaveBeenCalled()
      expect(winston.error).toHaveBeenCalledWith(`Server could not listen on port 8081`)
    })

    it('should log requests made to the server', async done => {
      try {
        const options = {
          method: 'POST',
          apiEndpoint: '/api/auth/signup',
          body: {
              email: 'testemail@gmail.com',
              username: 'testemail',
              password: 'password123'
          },
          json: true,
          resolveWithFullResponse: true
        }
        await apiCall(options)
        expect(winston.info).toHaveBeenCalled()
        done()
      } catch (err) {
        done()
      }
    })

    it('should return 404 Not Found error - /', async done => {
      try {
        await apiCall({})
      } catch(err) {
        expect(err.statusCode).toBe(404)
        expect(err.response.statusMessage).toBe('Not Found')
        expect(err.response.body).toBe('{"error":{"message":"Not Found"}}')
        done()
      }
    })

    it('should return an error response - /', async done => {
      try {
        await apiCall({})
      } catch (err) {
        expect(err).toBeInstanceOf(Error)
        done()
      }
    })

    it('should log errors handled by the request error handler middleware', async done => {
      try {
        await apiCall({})
      } catch (err) {
        expect(winston.error).toHaveBeenCalled()
        done()
      }
    })
  })
}
