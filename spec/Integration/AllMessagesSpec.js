const apiCall = require('./utils/Utils')

module.exports = () => {
  describe('All Messages - /api/messages', () => {
    it('should return all messages if user is signed in', async done => {
      try {
        let options = {
          method: 'POST',
          apiEndpoint: '/api/auth/signup',
          body: {
              email: 'testemail@gmail.com',
              username: 'testemail',
              password: 'password123'
          },
          json: true
        }
        const token = (await apiCall(options)).token
        
        options = {
          apiEndpoint: '/api/messages',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          json: true,
          resolveWithFullResponse: true
        }
        const res = await apiCall(options)
        expect(res.statusCode).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
        done()
      } catch (err) {
        done()
      }
    })
    
    it('should return 401 if user is not signed in', async done => {
      try {
        const options = {
          apiEndpoint: '/api/messages',
          json: true
        }
        await apiCall(options)
      } catch (err) {
        expect(err.statusCode).toBe(401)
        expect(err.error.error.message).toBe('Please log in first')
        done()
      }
    })

    it('should return 401 if invalid token is passed in header', async done => {
      try {
        const options = {
          apiEndpoint: '/api/messages',
          headers: {
            'Authorization': `Bearer someRandomToken`
          },
          json: true
        }
        await apiCall(options)
      } catch (err) {
        expect(err.statusCode).toBe(401)
        expect(err.error.error.message).toBe('Please log in first')
        done()
      }
    })
  })
}
