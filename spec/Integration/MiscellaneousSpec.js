const apiCall = require('./utils/Utils')

module.exports = () => {
  describe('Miscellaneous', () => {
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
  })
}
