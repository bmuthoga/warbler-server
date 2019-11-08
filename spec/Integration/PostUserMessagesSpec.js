const { apiCall } = require('../utils/Utils')

module.exports = () => {
  describe('POST User Messages Tests - /api/users/:id/messages', () => {
    it('should successfully post a new message if user is signed in and posting to the correct user id', async done => {
      try {
        let options = {
          method: 'POST',
          apiEndpoint: '/api/auth/signup',
          body: {
            email: 'testuser@gmail.com',
            password: 'password123',
            username: 'testuser'
          },
          json: true
        }
        const { id, token } = await apiCall(options)

        options = {
          ...options,
          apiEndpoint: `/api/users/${id}/messages`,
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: {
            text: 'This is a sample message'
          },
          resolveWithFullResponse: true
        }
        const res = await apiCall(options)
        expect(res.statusCode).toBe(200)
        expect(res.body.text).toEqual('This is a sample message')
        done()
      } catch (err) {
        done(err)
      }
    })

    it('should return 401 if the user is not signed in', async done => {
      try {
        let options = {
          method: 'POST',
          apiEndpoint: '/api/auth/signup',
          body: {
            email: 'testuser@gmail.com',
            password: 'password123',
            username: 'testuser'
          },
          json: true
        }
        const { id } = await apiCall(options)

        options = {
          ...options,
          apiEndpoint: `/api/users/${id}/messages`,
          body: {
            text: 'This is a sample message'
          }
        }
        await apiCall(options)
      } catch (err) {
        expect(err.statusCode).toBe(401)
        expect(err.error.error.message).toBe('Please log in first')
        done()
      }
    })

    it('should return 401 if the user is signed in but not posting to their own user id', async done => {
      try {
        let options = {
          method: 'POST',
          apiEndpoint: '/api/auth/signup',
          body: {
            email: 'testuser@gmail.com',
            password: 'password123',
            username: 'testuser'
          },
          json: true
        }
        const { token } = await apiCall(options)
        const incorrectUserId = '84ed9374gr79gf49'

        options = {
          ...options,
          apiEndpoint: `/api/users/${incorrectUserId}/messages`,
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: {
            text: 'This is a sample message'
          }
        }
        await apiCall(options)
      } catch (err) {
        expect(err.statusCode).toBe(401)
        expect(err.error.error.message).toBe('Unauthorized')
        done()
      }
    })

    it('should ignore an invalid property in the request body', async done => {
      try {
        let options = {
          method: 'POST',
          apiEndpoint: '/api/auth/signup',
          body: {
            email: 'testuser@gmail.com',
            password: 'password123',
            username: 'testuser'
          },
          json: true
        }
        const { id, token } = await apiCall(options)

        options = {
          ...options,
          apiEndpoint: `/api/users/${id}/messages`,
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: {
            text: 'This is a sample message',
            invalidProperty: 'This is an invalid property'
          },
          resolveWithFullResponse: true
        }
        const res = await apiCall(options)
        expect(res.statusCode).toBe(200)
        expect(res.body.text).toEqual('This is a sample message')
        done()
      } catch (err) {
        done(err)
      }
    })
  })
}
