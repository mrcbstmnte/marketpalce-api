'use strict'

const express = require('express')
const supertest = require('supertest')

const OrderController = require('@lib/controllers/order')
const Route = require('@routes/orders/create')

const { createMockServer } = require('@tests/_utils')
const { NotFoundError, BusinessLogicError } = require('@/lib/errors')

jest.mock('@lib/controllers/order')

describe('Order create route', () => {
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
      orderController: new OrderController()
    }

    route = new Route(router, context)
    route.setupRoutes()

    const app = createMockServer(route.router)

    request = (body) => supertest(app)
      .post('/order')
      .send(body)
  })

  beforeEach(() => {
    req = {
      body: {
        userId: 'userId'
      }
    }
  })

  describe('success', () => {
    it('should respond with 200 if order creation was successful', async () => {
      const response = await request(req.body).expect(200)

      expect(response.body).toStrictEqual({
        ok: true
      })

      expect(route.controller.create).toHaveBeenCalledTimes(1)
      expect(route.controller.create).toHaveBeenCalledWith('userId')
    })
  })

  describe('error', () => {
    it('should respond with 404 if the cart was not found', async () => {
      route.controller
        .create
        .mockRejectedValue(new NotFoundError('cart'))

      await request(req.body).expect(404)

      expect(route.controller.create).toHaveBeenCalledTimes(1)
    })

    it('should respond with 409 if the cart was empty', async () => {
      route.controller
        .create
        .mockRejectedValue(new BusinessLogicError('empty_cart'))

      await request(req.body).expect(409)

      expect(route.controller.create).toHaveBeenCalledTimes(1)
    })
  })
})
