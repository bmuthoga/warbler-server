const { apiCall } = require('../utils/Utils')

const authSpec = () => {
  describe('Auth Routes', () => {
  
    describe('Signup - /api/auth/signup', () => {
      it('should successfully signup a new user', async done => {
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
          const res = await apiCall(options)
          expect(res.statusCode).toBe(200)
          expect(res.body.username).toEqual('testemail')
          done()
        } catch (err) {
          done(err)
        }
      })
      
      it('should reject already existing email or username', async done => {
        try {
          const options = {
            method: 'POST',
            apiEndpoint: '/api/auth/signup',
            body: {
                email: 'testemail@gmail.com',
                username: 'testemail2',
                password: 'password123'
            },
            json: true,
            resolveWithFullResponse: true
          }
          await apiCall(options)
          await apiCall(options)
        } catch (err) {
          expect(err.statusCode).toBe(400)
          expect(err.error.error.message).toBe('Sorry, that username and / or email is taken.')
          done()
        }
      })
  
      it('should ignore an unknown property from the request body', async done => {
        try {
          const options = {
            method: 'POST',
            apiEndpoint: '/api/auth/signup',
            body: {
                email: 'hacker@gmail.com',
                username: 'hacker',
                password: 'password123',
                invalidProperty: 'hack the db'
            },
            json: true,
            resolveWithFullResponse: true
          }
          const res = await apiCall(options)
          expect(res.statusCode).toBe(200)
          expect(res.body.username).toBe('hacker')
          done()
        } catch (err) {
          done(err)
        }
      })
    })
  
    describe('Signin - /api/auth/signin', () => {
      it('should successfully signin an existing user', async done => {
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
          await apiCall(options)
  
          options = {
            method: 'POST',
            apiEndpoint: '/api/auth/signin',
            body: {
              email: 'testemail@gmail.com',
              password: 'password123'
            },
            json: true,
            resolveWithFullResponse: true
          }
          const res = await apiCall(options)
          expect(res.statusCode).toBe(200)
          expect(res.body.username).toEqual('testemail')
          expect(res.body.token).toBeDefined()
          done()
        } catch (err) {
          done(err)
        }
      })
  
      it('should return an error for an incorrect password', async done => {
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
          await apiCall(options)
  
          options = {
            method: 'POST',
            apiEndpoint: '/api/auth/signin',
            body: {
              email: 'testemail@gmail.com',
              password: 'incorrectPassword'
            },
            json: true,
            resolveWithFullResponse: true
          }
          await apiCall(options)
        } catch (err) {
          expect(err.statusCode).toBe(400)
          expect(err.error.error.message).toEqual('Invalid Email / Password.')
          done()
        }
      })
  
      it('should return an error for a non-existent user or any other error', async done => {
        try {
          const options = {
            method: 'POST',
            apiEndpoint: '/api/auth/signin',
            body: {
              email: 'testemail@gmail.com',
              password: 'password123'
            },
            json: true,
            resolveWithFullResponse: true
          }
          await apiCall(options)
        } catch (err) {
          expect(err.statusCode).toBe(400)
          expect(err.error.error.message).toEqual('Invalid Email / Password.')
          done()
        }
      })
      
      it('should ignore an unknown property from the request body', async done => {
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
          await apiCall(options)
  
          options = {
            method: 'POST',
            apiEndpoint: '/api/auth/signin',
            body: {
              email: 'testemail@gmail.com',
              password: 'password123',
              invalidProperty: 'theInvalidProperty'
            },
            json: true,
            resolveWithFullResponse: true
          }
          const res = await apiCall(options)
          expect(res.statusCode).toBe(200)
          expect(res.body.username).toEqual('testemail')
          expect(res.body.token).toBeDefined()
          done()
        } catch (err) {
          done(err)
        }
      })      
    })
  })
}

module.export = {
  authSpec
}
