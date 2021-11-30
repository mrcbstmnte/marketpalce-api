'use strict'

const express = require('express')
const supertest = require('supertest')

const CartController = require('@lib/controllers/cart')
const Route = require('@routes/carts/remove-product')

const { createMockServer } = require('@tests/_utils')
const { NotFoundError } = require('@/lib/errors')

jest.mock('@lib/controllers/cart')

describe('Cart remove product route', () => {
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
        cart: new CartController()
      }
    }

    route = new Route(router, context)
    route.setupRoutes()

    const app = createMockServer(route.router)

    request = (body) => supertest(app)
      .put('/cart/remove-product')
      .send(body)
  })

  beforeEach(() => {
    req = {
      body: {
        userId: 'userId',
        productIds: [
          'productId'
        ]
      }
    }
  })

  describe('success', () => {
    it('should respond with 200 if removal of product to cart was successful', async () => {
      const response = await request(req.body).expect(200)

      expect(response.body).toStrictEqual({
        ok: true
      })

      expect(route.controller.removeProduct).toHaveBeenCalledTimes(1)
      expect(route.controller.removeProduct).toHaveBeenCalledWith('userId', [
        'productId'
      ])
    })
  })

  describe('error', () => {
    it('should respond with 404 if NotFoundError was thrown', async () => {
      route.controller
        .removeProduct
        .mockRejectedValue(new NotFoundError('product'))

      await request(req.body).expect(404)

      expect(route.controller.removeProduct).toHaveBeenCalledTimes(1)
    })
  })
})
