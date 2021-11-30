'use strict'

const express = require('express')
const supertest = require('supertest')

const ProductController = require('@lib/controllers/product')
const Route = require('@routes/products/create')

const { createMockServer } = require('@tests/_utils')
const { NotFoundError } = require('@/lib/errors')

jest.mock('@lib/controllers/product')

describe('Product create route', () => {
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
      .post('/product')
      .send(body)
  })

  beforeEach(() => {
    req = {
      body: {
        sellerId: 'sellerId',
        product: {
          name: 'Seller A',
          stock: 15
        }
      }
    }
  })

  describe('success', () => {
    it('should respond with 200 if product creation was successful', async () => {
      const response = await request(req.body).expect(200)

      expect(response.body).toStrictEqual({
        ok: true
      })

      expect(route.controller.create).toHaveBeenCalledTimes(1)
      expect(route.controller.create).toHaveBeenCalledWith(
        'sellerId',
        {
          name: 'Seller A',
          stock: 15
        }
      )
    })
  })

  describe('error', () => {
    it('should respond with 404 if the seller was not found', async () => {
      route.controller
        .create
        .mockRejectedValue(new NotFoundError('seller'))

      await request(req.body).expect(404)

      expect(route.controller.create).toHaveBeenCalledTimes(1)
    })
  })
})
