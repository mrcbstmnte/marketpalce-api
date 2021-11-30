'use strict'

const express = require('express')
const supertest = require('supertest')

const OrderController = require('@lib/controllers/order')
const Route = require('@routes/orders/get')

const { createMockServer } = require('@tests/_utils')
const { NotFoundError } = require('@/lib/errors')

jest.mock('@lib/controllers/order')

describe('Order get route', () => {
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
        order: new OrderController()
      }
    }

    route = new Route(router, context)
    route.setupRoutes()

    const app = createMockServer(route.router)

    request = (query) => supertest(app)
      .get('/order')
      .query(query)
  })

  beforeEach(() => {
    route.controller
      .get
      .mockResolvedValue({
        id: 'orderId',
        products: []
      })

    req = {
      query: {
        orderId: 'orderId',
        userId: 'userId'
      }
    }
  })

  describe('success', () => {
    it('should respond with 200 if order retrieval was successful', async () => {
      const response = await request(req.query).expect(200)

      expect(response.body).toStrictEqual({
        ok: true,
        order: {
          id: 'orderId',
          products: []
        }
      })

      expect(route.controller.get).toHaveBeenCalledTimes(1)
      expect(route.controller.get).toHaveBeenCalledWith(
        'orderId',
        'userId'
      )
    })
  })

  describe('error', () => {
    it('should respond with 404 if the order was not found', async () => {
      route.controller
        .get
        .mockRejectedValue(new NotFoundError('order'))

      await request(req.body).expect(404)

      expect(route.controller.get).toHaveBeenCalledTimes(1)
    })
  })
})
