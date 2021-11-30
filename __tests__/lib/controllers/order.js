'use strict'

const {
  MongoClient,
  ObjectId
} = require('mongodb')

const OrdersModel = require('@models/orders')
const CartsModel = require('@models/carts')
const Controller = require('@lib/controllers/order')

const {
  NotFoundError, BusinessLogicError
} = require('@lib/errors')

jest.mock('@models/orders')
jest.mock('@models/carts')

describe('Order Controller', () => {
  /**
   * @type {Controller}
   */
  let controller

  /**
   * @type {MongoClient}
   */
  let mongoClient

  const userId = '407f191e810c19729de860ff'
  const productId = '5e24763552e7fadad71de15b'
  const sellerId = '5fff763552e7fadad71de15c'
  const orderId = '407f191e810c19729de860dd'

  beforeAll(async () => {
    mongoClient = new MongoClient('mongodb://localhost:27017', {
      useUnifiedTopology: true,
      writeConcern: 'majority',
      ignoreUndefined: true
    })

    await mongoClient.connect()

    controller = new Controller({
      ordersModel: new OrdersModel(mongoClient, {
        database: 'test'
      }),
      cartsModel: new CartsModel(mongoClient, {
        database: 'test'
      })
    })
  })

  describe('@Constructor', () => {
    it('should have an instance of orders model', () => {
      expect(controller.ordersModel).toBeInstanceOf(OrdersModel)
    })

    it('should have an instance of carts model', () => {
      expect(controller.cartsModel).toBeInstanceOf(CartsModel)
    })

    it('should throw an error if orders model is not provided', () => {
      expect(() => {
        return new Controller()
      }).toThrow()
    })

    it('should throw an error if carts model is not provided', () => {
      expect(() => {
        return new Controller({
          productsModel: new OrdersModel(mongoClient, {
            database: 'test'
          })
        })
      }).toThrow()
    })
  })

  describe('#create', () => {
    const products = [
      {
        id: productId,
        sellerId,
        quantity: 5
      }
    ]

    beforeEach(() => {
      controller.cartsModel
        .getById
        .mockResolvedValue({
          _id: new ObjectId(userId),
          products
        })
    })

    it('should create an order based from the cart', async () => {
      await controller.create(userId)

      expect(controller.cartsModel.getById).toHaveBeenCalledTimes(1)
      expect(controller.cartsModel.getById).toHaveBeenCalledWith(userId)

      expect(controller.ordersModel.create).toHaveBeenCalledTimes(1)
      expect(controller.ordersModel.create).toHaveBeenCalledWith(userId, products)
    })

    it('should throw a NotFoundError when the cart was not found', async () => {
      controller.cartsModel
        .getById
        .mockResolvedValue(null)

      await expect(async () => {
        await controller.create(userId)
      }).rejects.toThrow(NotFoundError)

      expect(controller.cartsModel.getById).toHaveBeenCalledTimes(1)
      expect(controller.ordersModel.create).toHaveBeenCalledTimes(0)
    })

    it('should throw a BusinessLogicError if the cart is empty', async () => {
      controller.cartsModel
        .getById
        .mockResolvedValue({
          products: []
        })

      await expect(async () => {
        await controller.create(userId)
      }).rejects.toThrow(BusinessLogicError)

      expect(controller.cartsModel.getById).toHaveBeenCalledTimes(1)
      expect(controller.ordersModel.create).toHaveBeenCalledTimes(0)
    })
  })

  describe('#get', () => {
    const products = [
      {
        id: productId,
        sellerId,
        quantity: 5,
        name: 'Battery',
        addedAt: new Date()
      }
    ]

    beforeEach(() => {
      controller.ordersModel
        .getById
        .mockResolvedValue({
          _id: new ObjectId(orderId),
          userId: new ObjectId(userId),
          products,
          createdAt: new Date(),
          updatedAt: new Date()
        })
    })

    it('should get the order of the user', async () => {
      const order = await controller.get(orderId, userId)

      expect(order).toStrictEqual({
        id: orderId,
        userId,
        products,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })

      expect(controller.ordersModel.getById).toHaveBeenCalledTimes(1)
      expect(controller.ordersModel.getById).toHaveBeenCalledWith(orderId, userId)
    })

    it('should throw a NotFoundError when the product was not found', async () => {
      controller.ordersModel
        .getById
        .mockResolvedValue(null)

      await expect(async () => {
        await controller.get(orderId, userId)
      }).rejects.toThrow(NotFoundError)

      expect(controller.ordersModel.getById).toHaveBeenCalledTimes(1)
    })
  })
})
