'use strict'

const express = require('express')
const supertest = require('supertest')

const SellerController = require('@lib/controllers/seller')
const Route = require('@routes/sellers/update')

const { createMockServer } = require('@tests/_utils')

jest.mock('@lib/controllers/seller')

describe('Seller update route', () => {
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
      sellerController: new SellerController()
    }

    route = new Route(router, context)
    route.setupRoutes()

    const app = createMockServer(route.router)

    request = (body) => supertest(app)
      .put('/seller')
      .send(body)
  })

  beforeEach(() => {
    req = {
      body: {
        id: 'sellerId',
        name: 'Seller A'
      }
    }
  })

  describe('success', () => {
    it('should respond with 200 if seller update was successful', async () => {
      const response = await request(req.body).expect(200)

      expect(response.body).toStrictEqual({
        ok: true
      })

      expect(route.controller.update).toHaveBeenCalledTimes(1)
      expect(route.controller.update).toHaveBeenCalledWith(
        'sellerId',
        {
          name: 'Seller A'
        }
      )
    })
  })
})
