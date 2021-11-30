'use strict'

const express = require('express')
const supertest = require('supertest')

const SellerController = require('@lib/controllers/seller')
const Route = require('@routes/sellers/list')

const { createMockServer } = require('@tests/_utils')

jest.mock('@lib/controllers/seller')

describe('Seller list route', () => {
  /**
   * @type {Route}
   */
  let route

  /**
   * @type {supertest}
   */
  let request

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

    request = () => supertest(app)
      .get('/sellers')
  })

  beforeEach(() => {
    route.controller
      .list
      .mockResolvedValue([
        {
          id: 'sellerId',
          name: 'Seller A'
        },
        {
          id: 'sellerId2',
          name: 'Seller B'
        }
      ])
  })

  describe('success', () => {
    it('should respond with 200 if seller list was fetched successfully', async () => {
      const response = await request().expect(200)

      expect(response.body).toStrictEqual({
        ok: true,
        sellers: [
          {
            id: 'sellerId',
            name: 'Seller A'
          },
          {
            id: 'sellerId2',
            name: 'Seller B'
          }
        ]
      })

      expect(route.controller.list).toHaveBeenCalledTimes(1)
    })
  })
})
