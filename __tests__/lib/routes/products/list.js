'use strict'

const express = require('express')
const supertest = require('supertest')

const ProductController = require('@lib/controllers/product')
const Route = require('@routes/products/list')

const { createMockServer } = require('@tests/_utils')

jest.mock('@lib/controllers/product')

describe('Product list route', () => {
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
      productController: new ProductController()
    }

    route = new Route(router, context)
    route.setupRoutes()

    const app = createMockServer(route.router)

    request = (query) => supertest(app)
      .get('/products')
      .query(query)
  })

  beforeEach(() => {
    route.controller
      .list
      .mockResolvedValue([
        {
          id: 'productId',
          sellerId: 'sellerId',
          name: 'Battery',
          stock: 5
        }
      ])

    req = {
      query: {
        sellerId: 'sellerId'
      }
    }
  })

  describe('success', () => {
    it('should respond with 200 if products retrieval was successful', async () => {
      const response = await request(req.query).expect(200)

      expect(response.body).toStrictEqual({
        ok: true,
        products: [
          {
            id: 'productId',
            sellerId: 'sellerId',
            name: 'Battery',
            stock: 5
          }
        ]
      })

      expect(route.controller.list).toHaveBeenCalledTimes(1)
      expect(route.controller.list).toHaveBeenCalledWith('sellerId')
    })
  })
})
