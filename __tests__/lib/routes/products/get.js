'use strict'

const express = require('express')
const supertest = require('supertest')

const ProductController = require('@lib/controllers/product')
const Route = require('@routes/products/get')

const { createMockServer } = require('@tests/_utils')
const { NotFoundError } = require('@/lib/errors')

jest.mock('@lib/controllers/product')

describe('Product get route', () => {
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
        product: new ProductController()
      }
    }

    route = new Route(router, context)
    route.setupRoutes()

    const app = createMockServer(route.router)

    request = (query) => supertest(app)
      .get('/product')
      .query(query)
  })

  beforeEach(() => {
    route.controller
      .get
      .mockResolvedValue({
        id: 'productId',
        sellerId: 'sellerId',
        name: 'Battery',
        stock: 5
      })

    req = {
      query: {
        sellerId: 'sellerId',
        productId: 'productId'
      }
    }
  })

  describe('success', () => {
    it('should respond with 200 if product retrieval was successful', async () => {
      const response = await request(req.query).expect(200)

      expect(response.body).toStrictEqual({
        ok: true,
        product: {
          id: 'productId',
          sellerId: 'sellerId',
          name: 'Battery',
          stock: 5
        }
      })

      expect(route.controller.get).toHaveBeenCalledTimes(1)
      expect(route.controller.get).toHaveBeenCalledWith(
        'productId',
        'sellerId'
      )
    })
  })

  describe('error', () => {
    it('should respond with 404 if the product was not found', async () => {
      route.controller
        .get
        .mockRejectedValue(new NotFoundError('product'))

      await request(req.body).expect(404)

      expect(route.controller.get).toHaveBeenCalledTimes(1)
    })
  })
})
