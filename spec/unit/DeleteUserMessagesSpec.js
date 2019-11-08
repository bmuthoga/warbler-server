const { apiCall, mockApi, generateRandomString } = require('../utils/Utils')

const token = generateRandomString()

const users = [{
  _id: generateRandomString(),
  email: 'testemail@gmail.com',
  username: 'testemail',
  password: 'password123'
}]

const messages = [{
  _id: generateRandomString(),
  text: 'Sample message text',
  user: {
    _id: users[0]._id,
    username: users[0].username,
    profileImageUrl: ''
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}]

const options = {
  method: 'DELETE',
  json: true
}

const setupMockDeleteMessage = ({ userId, messageId }) => {
  const foundMessage = messages.filter(msg => msg._id === messageId)

  return mockApi.delete(`/api/users/${userId}/messages/${messageId}`)
    .reply(function() {
      const authToken = this.req.headers.authorization ?
        this.req.headers.authorization.split(' ')[1] :
        null

      if (!authToken || (authToken && authToken !== token)) {
        return [
          401,
          {
            error: {
              message: 'Please log in first'
            }
          }
        ]
      } else if (userId !== users[0]._id) {
        return [
          401,
          {
            error: {
              message: 'Unauthorized'
            }
          }
        ]
      } else if (foundMessage.length !== 1) {
        return [
          500,
          {
            error: {
              message: 'Oops! Something went wrong.'
            }
          }
        ]
      } else {
        return [
          200,
          foundMessage[0]
        ]
      }
    })
}

module.exports = () => {
  describe('DELETE User Messages Tests - /api/users/:id/messages/:message_id', () => {
    it('should successfully delete a message if the user is signed in and making the request to their own id', async done => {
      try {
        setupMockDeleteMessage({
          userId: users[0]._id,
          messageId: messages[0]._id
        })
        const res = await apiCall({
          ...options,
          apiEndpoint: `/api/users/${users[0]._id}/messages/${messages[0]._id}`,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        expect(res._id).toEqual(messages[0]._id)
        expect(res.user._id).toEqual(users[0]._id)
        expect(typeof res).toBe('object')
        expect(res.constructor === Object).toBe(true)
        done()
      } catch (err) {
        done(err)
      }
    })
    
    it('should return 401 if the user is not signed in', async done => {
      try {
        setupMockDeleteMessage({
          userId: users[0]._id,
          messageId: messages[0]._id
        })
        await apiCall({
          ...options,
          apiEndpoint: `/api/users/${users[0]._id}/messages/${messages[0]._id}`
        })
      } catch (err) {
        expect(err.statusCode).toBe(401)
        expect(err.error.error.message).toBe('Please log in first')
        done()
      }
    })
    
    it('should return 401 if invalid auth token is provided', async done => {
      try {
        setupMockDeleteMessage({
          userId: users[0]._id,
          messageId: messages[0]._id
        })
        await apiCall({
          ...options,
          apiEndpoint: `/api/users/${users[0]._id}/messages/${messages[0]._id}`,
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
    
    it('should return 401 if the user is signed in but not making the request to their own id', async done => {
      try {
        const invalidUserId = generateRandomString()
        setupMockDeleteMessage({
          userId: invalidUserId,
          messageId: messages[0]._id
        })
        await apiCall({
          ...options,
          apiEndpoint: `/api/users/${invalidUserId}/messages/${messages[0]._id}`,
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
    
    it('should return 500 if the request is made to a non-existent message id', async done => {
      try {
        const invalidMessageId = generateRandomString()
        setupMockDeleteMessage({
          userId: users[0]._id,
          messageId: invalidMessageId
        })
        await apiCall({
          ...options,
          apiEndpoint: `/api/users/${users[0]._id}/messages/${invalidMessageId}`,
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
