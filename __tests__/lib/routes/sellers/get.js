'use strict'

const express = require('express')
const supertest = require('supertest')

const SellerController = require('@lib/controllers/seller')
const Route = require('@routes/sellers/get')

const { createMockServer } = require('@tests/_utils')
const { NotFoundError } = require('@/lib/errors')

jest.mock('@lib/controllers/seller')

describe('Seller get route', () => {
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
        seller: new SellerController()
      }
    }

    route = new Route(router, context)
    route.setupRoutes()

    const app = createMockServer(route.router)

    request = (query) => supertest(app)
      .get('/seller')
      .query(query)
  })

  beforeEach(() => {
    route.controller
      .get
      .mockResolvedValue({
        id: 'sellerId',
        name: 'Seller A'
      })

    req = {
      query: {
        id: 'sellerId'
      }
    }
  })

  describe('success', () => {
    it('should respond with 200 if seller fetching was successful', async () => {
      const response = await request(req.query).expect(200)

      expect(response.body).toStrictEqual({
        ok: true,
        seller: {
          id: 'sellerId',
          name: 'Seller A'
        }
      })

      expect(route.controller.get).toHaveBeenCalledTimes(1)
      expect(route.controller.get).toHaveBeenCalledWith('sellerId')
    })
  })

  describe('error', () => {
    it('should throw a NotFoundError when the seller was not found', async () => {
      route.controller
        .get
        .mockRejectedValue(new NotFoundError('seller'))

      await request(req.body).expect(404)

      expect(route.controller.get).toHaveBeenCalledTimes(1)
    })
  })
})
