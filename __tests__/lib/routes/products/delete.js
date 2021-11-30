'use strict'

const express = require('express')
const supertest = require('supertest')

const ProductController = require('@lib/controllers/product')
const Route = require('@routes/products/delete')

const { createMockServer } = require('@tests/_utils')
const { NotFoundError } = require('@/lib/errors')

jest.mock('@lib/controllers/product')

describe('Product delete route', () => {
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

    request = (body) => supertest(app)
      .delete('/product')
      .send(body)
  })

  beforeEach(() => {
    req = {
      body: {
        sellerId: 'sellerId',
        productId: 'productId'
      }
    }
  })

  describe('success', () => {
    it('should respond with 200 if product deletion was successful', async () => {
      const response = await request(req.body).expect(200)

      expect(response.body).toStrictEqual({
        ok: true
      })

      expect(route.controller.delete).toHaveBeenCalledTimes(1)
      expect(route.controller.delete).toHaveBeenCalledWith(
        'productId',
        'sellerId'
      )
    })
  })

  describe('error', () => {
    it('should respond with 404 if the product was not found', async () => {
      route.controller
        .delete
        .mockRejectedValue(new NotFoundError('product'))

      await request(req.body).expect(404)

      expect(route.controller.delete).toHaveBeenCalledTimes(1)
    })
  })
})
