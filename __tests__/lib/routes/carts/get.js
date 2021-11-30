'use strict'

const express = require('express')
const supertest = require('supertest')

const CartController = require('@lib/controllers/cart')
const Route = require('@routes/carts/get')

const { createMockServer } = require('@tests/_utils')
const { NotFoundError } = require('@/lib/errors')

jest.mock('@lib/controllers/cart')

describe('Cart get route', () => {
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

    request = (query) => supertest(app)
      .get('/cart')
      .query(query)
  })

  beforeEach(() => {
    route.controller
      .get
      .mockResolvedValue({
        id: 'userId',
        products: []
      })

    req = {
      query: {
        userId: 'userId'
      }
    }
  })

  describe('success', () => {
    it('should respond with 200 if cart retrieval was successful', async () => {
      const response = await request(req.query).expect(200)

      expect(response.body).toStrictEqual({
        ok: true,
        cart: {
          id: 'userId',
          products: []
        }
      })

      expect(route.controller.get).toHaveBeenCalledTimes(1)
      expect(route.controller.get).toHaveBeenCalledWith('userId')
    })
  })

  describe('error', () => {
    it('should respond with 404 if the cart was not found', async () => {
      route.controller
        .get
        .mockRejectedValue(new NotFoundError('cart'))

      await request(req.body).expect(404)

      expect(route.controller.get).toHaveBeenCalledTimes(1)
    })
  })
})
