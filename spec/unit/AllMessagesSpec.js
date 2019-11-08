const { apiCall, mockApi, generateRandomString } = require('../utils/Utils')

const options = {
  apiEndpoint: '/api/messages',
  json: true
}

const token = generateRandomString()

const setupMockMessages = () => (
  mockApi.get('/api/messages')
    .reply(function() {
      const headerToken = this.req.headers.authorization ?
        this.req.headers.authorization.split(' ')[1] :
        null

      if (headerToken && headerToken === token) {
        return [
          200,
          []
        ]
      }
      return [
        401,
        {
          error: {
            message: 'Please log in first'
          }
        }
      ]
    })
)

module.exports = () => {
  describe('All Messages - /api/messages', () => {
    it('should return all messages if user is signed in', async done => {
      try {
        setupMockMessages()
        const res = await apiCall({
          ...options,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        expect(Array.isArray(res)).toBe(true)
        done()
      } catch (err) {
        done(err)
      }
    })

    it('should return 401 if user is not signed in', async done => {
      try {
        setupMockMessages()
        await apiCall(options)
      } catch (err) {
        expect(err.statusCode).toBe(401)
        expect(err.error.error.message).toBe('Please log in first')
        done()
      }
    })
    
    it('should return 401 if invalid token is passed in authorization header', async done => {
      try {
        setupMockMessages()
        await apiCall({
          ...options,
          headers: {
            'Authorization': `Bearer ${generateRandomString()}`
          }
        })
      } catch (err) {
        expect(err.statusCode).toBe(401)
        expect(err.error.error.message).toBe('Please log in first')
        done()
      }
    })
  })
}
