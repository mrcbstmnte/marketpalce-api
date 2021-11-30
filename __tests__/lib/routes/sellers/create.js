'use strict'

const express = require('express')
const supertest = require('supertest')

const SellerController = require('@lib/controllers/seller')
const Route = require('@routes/sellers/create')

const { createMockServer } = require('@tests/_utils')

jest.mock('@lib/controllers/seller')

describe('Seller create route', () => {
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
      controllers: {
        seller: new SellerController()
      }
    }

    route = new Route(router, context)
    route.setupRoutes()

    const app = createMockServer(route.router)

    request = (body) => supertest(app)
      .post('/seller')
      .send(body)
  })

  beforeEach(() => {
    req = {
      body: {
        name: 'Seller A'
      }
    }
  })

  describe('success', () => {
    it('should respond with 200 if seller creation was successful', async () => {
      const response = await request(req.body).expect(200)

      expect(response.body).toStrictEqual({
        ok: true
      })

      expect(route.controller.create).toHaveBeenCalledTimes(1)
      expect(route.controller.create).toHaveBeenCalledWith({
        name: 'Seller A'
      })
    })
  })
})
