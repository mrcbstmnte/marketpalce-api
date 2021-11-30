'use strict'

const express = require('express')
const supertest = require('supertest')

const SellerController = require('@lib/controllers/seller')
const Route = require('@routes/sellers/delete')

const { createMockServer } = require('@tests/_utils')
const { NotFoundError } = require('@/lib/errors')

jest.mock('@lib/controllers/seller')

describe('Seller delete route', () => {
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
      sellerController: new SellerController()
    }

    route = new Route(router, context)
    route.setupRoutes()

    const app = createMockServer(route.router)

    request = (body) => supertest(app)
      .delete('/seller')
      .send(body)
  })

  beforeEach(() => {
    req = {
      body: {
        id: 'sellerId'
      }
    }
  })

  describe('success', () => {
    it('should respond with 200 if seller deletion was successful', async () => {
      const response = await request(req.body).expect(200)

      expect(response.body).toStrictEqual({
        ok: true
      })

      expect(route.controller.delete).toHaveBeenCalledTimes(1)
      expect(route.controller.delete).toHaveBeenCalledWith('sellerId')
    })
  })

  describe('error', () => {
    it('should throw a NotFoundError when the seller was not found', async () => {
      route.controller
        .delete
        .mockRejectedValue(new NotFoundError('seller'))

      await request(req.body).expect(404)

      expect(route.controller.delete).toHaveBeenCalledTimes(1)
    })
  })
})
