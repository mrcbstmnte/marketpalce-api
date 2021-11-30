'use strict'

const express = require('express')
const supertest = require('supertest')

const UserController = require('@lib/controllers/user')
const Route = require('@routes/users/create')

const { createMockServer } = require('@tests/_utils')

jest.mock('@lib/controllers/user')

describe('User create route', () => {
  /**
   * @type {Route}
   */
  let route

  /**
   * @type {supertest}
   */
  let request
  let req

  beforeAll(() => {
    const router = express.Router()
    const context = {
      userController: new UserController()
    }

    route = new Route(router, context)
    route.setupRoutes()

    const app = createMockServer(route.router)

    request = (body) => supertest(app)
      .post('/user')
      .send(body)
  })

  beforeEach(() => {
    req = {
      body: {
        name: 'User A',
        email: 'test@gmail.com',
        password: 'password',
        role: 'user'
      }
    }
  })

  describe('success', () => {
    it('should respond with 200 if user creation was successful', async () => {
      const response = await request(req.body).expect(200)

      expect(response.body).toStrictEqual({
        ok: true
      })

      expect(route.controller.create).toHaveBeenCalledTimes(1)
      expect(route.controller.create).toHaveBeenCalledWith({
        name: 'User A',
        email: 'test@gmail.com',
        password: 'password',
        role: 'user'
      })
    })
  })
})
