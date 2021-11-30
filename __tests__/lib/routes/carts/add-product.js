'use strict'

const express = require('express')
const supertest = require('supertest')

const CartController = require('@lib/controllers/cart')
const Route = require('@routes/carts/add-product')

const { createMockServer } = require('@tests/_utils')
const { NotFoundError, BusinessLogicError } = require('@/lib/errors')

jest.mock('@lib/controllers/cart')

describe('Cart add product route', () => {
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
      cartController: new CartController()
    }

    route = new Route(router, context)
    route.setupRoutes()

    const app = createMockServer(route.router)

    request = (body) => supertest(app)
      .put('/cart/add-product')
      .send(body)
  })

  beforeEach(() => {
    req = {
      body: {
        userId: 'userId',
        product: {
          id: 'productId',
          sellerId: 'sellerId',
          quantity: 5
        }
      }
    }
  })

  describe('success', () => {
    it('should respond with 200 if adding of product to cart was successful', async () => {
      const response = await request(req.body).expect(200)

      expect(response.body).toStrictEqual({
        ok: true
      })

      expect(route.controller.addProduct).toHaveBeenCalledTimes(1)
      expect(route.controller.addProduct).toHaveBeenCalledWith('userId', {
        id: 'productId',
        sellerId: 'sellerId',
        quantity: 5
      })
    })
  })

  describe('error', () => {
    it('should respond with 404 if NotFoundError was thrown', async () => {
      route.controller
        .addProduct
        .mockRejectedValue(new NotFoundError('cart'))

      await request(req.body).expect(404)

      expect(route.controller.addProduct).toHaveBeenCalledTimes(1)
    })

    it('should respond with 409 if the product has low stock', async () => {
      route.controller
        .addProduct
        .mockRejectedValue(new BusinessLogicError('low_on_stock'))

      await request(req.body).expect(409)

      expect(route.controller.addProduct).toHaveBeenCalledTimes(1)
    })
  })
})
