const { apiCall, mockApi, generateRandomString } = require('../utils/Utils')

const token = generateRandomString()

const users = [{
  id: generateRandomString(),
  email: 'testemail@gmail.com',
  username: 'testemail',
  password: 'password123'
}]

const messages = [{
  id: generateRandomString(),
  text: 'Sample message text',
  user: {
    _id: users[0].id,
    username: users[0].username,
    profileImageUrl: ''
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}]

const options = {
  method: 'POST',
  body: {
    text: 'Sample message text'
  },
  json: true
}

const setupMockPostMessages = (body, id) => (
  mockApi.post(`/api/users/${id}/messages`, body)
    .reply(function(uri, requestBody) {
      const headerToken = this.req.headers.authorization ?
        this.req.headers.authorization.split(' ')[1] :
        null

      if (!headerToken || (headerToken && headerToken !== token)) {
        return [
          401,
          {
            error: {
              message: 'Please log in first'
            }
          }
        ]
      } else if (id !== users[0].id) {
        return [
          401,
          {
            error: {
              message: 'Unauthorized'
            }
          }
        ]
      } else if (!requestBody.text) {
        return [
          500,
          {
            error: {
              message: 'Oops! Something went wrong.'
            }
          }
        ]
      } else {
        const foundMessage = messages.filter(msg => msg.text === requestBody.text)
        return [
          200,
          foundMessage[0]
        ]
      }
    })
)

module.exports = () => {
  describe('POST User Messages Tests - /api/users/:id/messages', () => {
    it('should successfully post a new message if user is signed in and posting to the correct user id', async done => {
      try {
        setupMockPostMessages(options.body, users[0].id)
        const res = await apiCall({
          ...options,
          apiEndpoint: `/api/users/${users[0].id}/messages`,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        expect(res.text).toBe('Sample message text')
        expect(res.user._id).toBe(users[0].id)
        expect(typeof res).toBe('object')
        expect(res.constructor === Object).toBe(true)
        done()
      } catch (err) {
        done(err)
      }
    })

    it('should ignore an invalid property in request body', async done => {
      try {
        setupMockPostMessages({
          ...options.body,
          invalidProperty: 'theInvalidProperty'
        }, users[0].id)
        const res = await apiCall({
          ...options,
          body: {
            ...options.body,
            invalidProperty: 'theInvalidProperty'
          },
          apiEndpoint: `/api/users/${users[0].id}/messages`,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        expect(res.text).toBe('Sample message text')
        expect(res.user._id).toBe(users[0].id)
        expect(typeof res).toBe('object')
        expect(res.constructor === Object).toBe(true)
        done()
      } catch (err) {
        done(err)
      }
    })    
    
    it('should return 401 if the user is not signed in', async done => {
      try {
        setupMockPostMessages(options.body, users[0].id)
        await apiCall({
          ...options,
          apiEndpoint: `/api/users/${users[0].id}/messages`
        })
      } catch (err) {
        expect(err.statusCode).toBe(401)
        expect(err.error.error.message).toBe('Please log in first')
        done()
      }
    })

    it('should return 401 if invalid authorization token is provided', async done => {
      try {
        setupMockPostMessages(options.body, users[0].id)
        await apiCall({
          ...options,
          apiEndpoint: `/api/users/${users[0].id}/messages`,
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
    
    it('should return 401 if the user is signed in but not making request to their own user id', async done => {
      try {
        const invalidUserId = generateRandomString()
        setupMockPostMessages(options.body, invalidUserId)
        await apiCall({
          ...options,
          apiEndpoint: `/api/users/${invalidUserId}/messages`,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      } catch (err) {
        expect(err.statusCode).toBe(401)
        expect(err.error.error.message).toBe('Unauthorized')
        done()
      }
    })

    it('should return 500 if text property / field is missing from request body', async done => {
      try {
        setupMockPostMessages({}, users[0].id)
        await apiCall({
          ...options,
          body: {},
          apiEndpoint: `/api/users/${users[0].id}/messages`,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      } catch (err) {
        expect(err.statusCode).toBe(500)
        expect(err.error.error.message).toBe('Oops! Something went wrong.')
        done()
      }
    })
  })
}
