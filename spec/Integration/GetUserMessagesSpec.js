const { apiCall } = require('../utils/Utils')

module.exports = () => {
  describe('GET User Messages Tests - /api/users/:id/messages/:message_id', () => {
    it('should successfully fetch a message if the user is signed in and making the request to their own id', async done => {
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
          }
        }
        const { _id } = await apiCall(options)

        options = {
          apiEndpoint: `/api/users/${id}/messages/${_id}`,
          headers: {
            'Authorization': `Bearer ${token}`
          },
          json: true,
          resolveWithFullResponse: true
        }
        const res = await apiCall(options)
        expect(res.statusCode).toBe(200)
        expect(res.body.text).toEqual('This is a sample message')
        expect(res.body._id).toEqual(_id)
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
        const { id, token } = await apiCall(options)

        options = {
          ...options,
          apiEndpoint: `/api/users/${id}/messages`,
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: {
            text: 'This is a sample message'
          }
        }
        const { _id } = await apiCall(options)

        options = {
          apiEndpoint: `/api/users/${id}/messages/${_id}`,
          json: true
        }
        await apiCall(options)
      } catch (err) {
        expect(err.statusCode).toBe(401)
        expect(err.error.error.message).toBe('Please log in first')
        done()
      }
    })

    it('should return 401 if the user is signed in but not making GET request to their own id', async done => {
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
          }
        }
        const { _id } = await apiCall(options)
        const incorrectUserId = '3h4g68d84838'

        options = {
          apiEndpoint: `/api/users/${incorrectUserId}/messages/${_id}`,
          headers: {
            'Authorization': `Bearer ${token}`
          },
          json: true
        }
        await apiCall(options)
      } catch (err) {
        expect(err.statusCode).toBe(401)
        expect(err.error.error.message).toBe('Unauthorized')
        done()
      }
    })

    it('should return 500 if signed in but making GET request to non-existent message id', async done => {
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
        const incorrectMessageId = '43h6h6h4h5j'

        options = {
          apiEndpoint: `/api/users/${id}/messages/${incorrectMessageId}`,
          headers: {
            'Authorization': `Bearer ${token}`
          },
          json: true
        }
        await apiCall(options)
      } catch (err) {
        expect(err.statusCode).toBe(500)
        done()
      }
    })
  })
}
