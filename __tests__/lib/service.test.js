'use strict'

const path = require('path')

const CartsModel = require('@models/carts')
const OrdersModel = require('@models/orders')
const ProductsModel = require('@models/products')
const SellersModel = require('@models/sellers')
const UsersModel = require('@models/users')

const CartController = require('@lib/controllers/cart')
const OrderController = require('@lib/controllers/order')
const ProductController = require('@lib/controllers/product')
const SellerController = require('@lib/controllers/seller')
const UserController = require('@lib/controllers/user')

const Service = require('@lib/service')
const router = require('@lib/router')
const { getConfig } = require('@tests/_utils')

const APP_ROOT = path.resolve(__dirname, '../../')

function noop () {}

jest.mock('@lib/router')

describe('Service', () => {
  /**
   * @type {Service}
   */
  let service

  const config = getConfig()

  beforeAll(() => {
    service = new Service(config)
  })

  describe('@Constructor', () => {
    it('should have an instance of models', () => {
      expect(service.models).toEqual({})
    })

    it('should have an instance of controllers', () => {
      expect(service.controllers).toEqual({})
    })
  })

  describe('#start', () => {
    beforeEach(() => {
      jest.spyOn(service, 'setupDependencies')
        .mockResolvedValue()

      jest.spyOn(service, 'setupServer')
        .mockReturnValue()
    })

    it('should start the service', async () => {
      await service.start()

      expect(service.setupDependencies).toHaveBeenCalledTimes(1)
      expect(service.setupServer).toHaveBeenCalledTimes(1)
    })
  })

  describe('#setupDependencies', () => {
    beforeEach(async () => {
      await service.setupDependencies()
    })

    it('should have an express instance', () => {
      expect(service.app).toBeDefined()
    })

    it('should have an express router instance', () => {
      expect(service.router).toBeDefined()
    })

    describe('models', () => {
      it('should have an instance of carts model', () => {
        expect(service.models.carts).toBeInstanceOf(CartsModel)
      })

      it('should have an instance of orders model', () => {
        expect(service.models.orders).toBeInstanceOf(OrdersModel)
      })

      it('should have an instance of products model', () => {
        expect(service.models.products).toBeInstanceOf(ProductsModel)
      })

      it('should have an instance of sellers model', () => {
        expect(service.models.sellers).toBeInstanceOf(SellersModel)
      })

      it('should have an instance of users model', () => {
        expect(service.models.users).toBeInstanceOf(UsersModel)
      })
    })

    describe('controllers', () => {
      it('should have an instance of cart controller', () => {
        expect(service.controllers.cart).toBeInstanceOf(CartController)
      })

      it('should have an instance of order controller', () => {
        expect(service.controllers.order).toBeInstanceOf(OrderController)
      })

      it('should have an instance of product controller', () => {
        expect(service.controllers.product).toBeInstanceOf(ProductController)
      })

      it('should have an instance of seller controller', () => {
        expect(service.controllers.seller).toBeInstanceOf(SellerController)
      })

      it('should have an instance of user controller', () => {
        expect(service.controllers.user).toBeInstanceOf(UserController)
      })
    })
  })

  describe('#setupServer', () => {
    beforeEach(async () => {
      await service.setupDependencies()

      jest.spyOn(service, 'startListening')
        .mockImplementation(noop)
      jest.spyOn(service, 'setupRoutes')
        .mockImplementation(noop)
    })

    it('should setup the server', () => {
      service.setupServer()

      expect(service.startListening).toHaveBeenCalledTimes(1)
      expect(service.setupRoutes).toHaveBeenCalledTimes(1)
    })
  })

  describe('#getRoutePath', function () {
    it('should return absolute path to route folder', function () {
      expect(service.getRoutePath()).toEqual(`${APP_ROOT}/lib/routes`)
    })
  })

  describe('#setupRoutes', () => {
    beforeEach(async () => {
      await service.setupDependencies()

      jest.spyOn(service.app, 'use')
      jest.spyOn(service, 'getRoutePath')
        .mockReturnValue('./api')
    })

    it('should setup routes and use routers', () => {
      service.setupRoutes()

      expect(service.getRoutePath).toHaveBeenCalledTimes(1)

      expect(router.setup).toHaveBeenCalledTimes(1)
      expect(router.setup).toHaveBeenCalledWith(
        './api',
        service.router,
        service
      )

      expect(service.app.use).toHaveBeenCalledTimes(2)
      expect(service.app.use).toHaveBeenNthCalledWith(1, expect.any(Function))
      expect(service.app.use).toHaveBeenNthCalledWith(
        2,
        service.router
      )
    })
  })

  describe('#startListening', () => {
    beforeEach(async () => {
      await service.setupDependencies()

      jest.spyOn(service.app, 'listen')
        .mockImplementation(noop)
    })

    it('should listen to the http server', () => {
      service.startListening()

      expect(service.app.listen).toHaveBeenCalledTimes(1)
      expect(service.app.listen).toHaveBeenCalledWith(3004)
    })
  })
})
