const { apiCall, mockApi, generateRandomString } = require('../utils/Utils')

const users = [{
  id: generateRandomString(),
  email: 'testemail@gmail.com',
  username: 'testemail',
  password: 'password123'
}]

const signUpOptions = {
  method: 'POST',
  apiEndpoint: '/api/auth/signup',
  body: {
    email: users[0].email,
    username: users[0].username,
    password: users[0].password
  },
  json: true
}

const signinOptions = {
  method: 'POST',
  apiEndpoint: '/api/auth/signin',
  body: {
    email: users[0].email,
    password: users[0].password
  },
  json: true
}

const token = generateRandomString()

const setupMockSignin = body => (
  mockApi.post('/api/auth/signin', body)
    .reply((uri, requestBody) => {
      if (users.filter(user => user.email === requestBody.email && user.password === requestBody.password).length === 1) {
        return [
          200,
          {
            id: users[0].id,
            username: users[0].username,
            token
          }
        ]
      }
      return [
        400,
        {
          error: {
            message: 'Invalid Email / Password.'
          }
        }
      ]
    })
)

module.exports = () => {
  describe('Auth Routes', () => {
    describe('Signup - /api/auth/signup', () => {
      it('should successfully signup a new user', async done => {
        try {
          mockApi.post('/api/auth/signup', signUpOptions.body)
            .reply(200, {
              id: users[0].id,
              username: users[0].username,
              token
            })

          const res = await apiCall(signUpOptions)
          expect(res.id).toEqual(users[0].id)
          expect(res.username).toEqual(users[0].username)
          expect(res.token).toEqual(token)
          done()
        } catch (err) {
          done(err)
        }
      })
      
      it('should reject already existing email or username', async done => {
        try {
          mockApi.post('/api/auth/signup', signUpOptions.body)
            .reply((uri, requestBody) => {
              if (users.filter(user => user.email === requestBody.email || user.username === requestBody.username).length === 1) {
                return [
                  400,
                  {
                    error: {
                      message: 'Sorry, that username and / or email is taken.'
                    }
                  }
                ]
              }
              return [
                200,
                {
                  id: users[0].id,
                  username: users[0].username,
                  token
                }
              ]
            })

          await apiCall(signUpOptions)
        } catch (err) {
          expect(err.statusCode).toBe(400)
          expect(err.error.error.message).toBe('Sorry, that username and / or email is taken.')
          done()
        }
      })
      
      it('should ignore an unknown property from the request body', async done => {
        try {
          mockApi.post('/api/auth/signup', {
            ...signUpOptions.body,
            invalidProperty: 'theInvalidProperty'
          })
            .reply(200, {
              id: users[0].id,
              username: users[0].username,
              token
            })

          const res = await apiCall({
            ...signUpOptions,
            body: {
              ...signUpOptions.body,
              invalidProperty: 'theInvalidProperty'
            }
          })
          expect(res.id).toEqual(users[0].id)
          expect(res.username).toEqual(users[0].username)
          expect(res.token).toEqual(token)
          done()
        } catch (err) {
          done(err)
        }
      })
    })

    describe('Signin - /api/auth/signin', () => {
      it('should successfully signin an existing user', async done => {
        try {
          setupMockSignin(signinOptions.body)
          const res = await apiCall(signinOptions)
          expect(res.id).toEqual(users[0].id)
          expect(res.username).toEqual(users[0].username)
          expect(res.token).toEqual(token)
          done()
        } catch (err) {
          done(err)
        }
      })
      
      it("should return an error if the user doesn't exist or the email / password is incorrect", async done => {
        try {
          setupMockSignin({
            ...signinOptions.body,
            password: 'incorrectPassword'
          })

          await apiCall({
            ...signinOptions,
            body: {
              ...signinOptions.body,
              password: 'incorrectPassword'
            }
          })
        } catch (err) {
          expect(err.statusCode).toBe(400)
          expect(err.error.error.message).toEqual('Invalid Email / Password.')
          done()
        }
      })
      
      it('should ignore an unknown property from the request body', async done => {
        try {
          setupMockSignin({
            ...signinOptions.body,
            invalidProperty: 'theInvalidProperty'
          })

          const res = await apiCall({
            ...signinOptions,
            body: {
              ...signinOptions.body,
              invalidProperty: 'theInvalidProperty'
            }
          })
          expect(res.id).toEqual(users[0].id)
          expect(res.username).toEqual(users[0].username)
          expect(res.token).toEqual(token)
          done()
        } catch (err) {
          done(err)
        }
      })
    })
  })
}
