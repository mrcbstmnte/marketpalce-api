'use strict'

const {
  MongoClient,
  ObjectId
} = require('mongodb')

const CartsModel = require('@models/carts')
const ProductsModel = require('@models/products')
const Controller = require('@lib/controllers/cart')
const { NotFoundError } = require('@/lib/errors')

jest.mock('@models/carts')
jest.mock('@models/products')

describe('Cart Controller', () => {
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
  const sellerId = '5e24763552e7fadad71de15b'

  beforeAll(async () => {
    mongoClient = new MongoClient('mongodb://localhost:27017', {
      useUnifiedTopology: true,
      writeConcern: 'majority',
      ignoreUndefined: true
    })

    await mongoClient.connect()

    controller = new Controller({
      cartsModel: new CartsModel(mongoClient, {
        databaseName: 'test'
      }),
      productsModel: new ProductsModel(mongoClient, {
        databaseName: 'test'
      })
    })
  })

  describe('@Constructor', () => {
    it('should have an instance of carts model', () => {
      expect(controller.cartsModel).toBeInstanceOf(CartsModel)
    })

    it('should have an instance of products model', () => {
      expect(controller.productsModel).toBeInstanceOf(ProductsModel)
    })

    it('should throw an error if carts model is not provided', () => {
      expect(() => {
        return new Controller()
      }).toThrow()
    })

    it('should throw an error if products model is not provided', () => {
      expect(() => {
        return new Controller({
          cartsModel: new CartsModel(mongoClient, {
            databaseName: 'test'
          })
        })
      }).toThrow()
    })
  })

  describe('#get', () => {
    const products = [
      {
        id: productId,
        name: 'Battery',
        quantity: 5,
        addedAt: new Date()
      }
    ]

    beforeEach(() => {
      controller.cartsModel
        .getById
        .mockResolvedValue({
          _id: new ObjectId(userId),
          products,
          createdAt: new Date(),
          updatedAt: new Date()
        })
    })

    it('should get the user\'s cart and it\'s products', async () => {
      const cart = await controller.get(userId)

      expect(cart).toStrictEqual({
        id: userId,
        products,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })

      expect(controller.cartsModel.getById).toHaveBeenCalledTimes(1)
      expect(controller.cartsModel.getById).toHaveBeenCalledWith(userId)
    })

    it('should throw a NotFoundError if the cart was not found', async () => {
      controller.cartsModel
        .getById
        .mockResolvedValue(null)

      expect(async () => {
        await controller.get(userId)
      }).rejects.toThrow(NotFoundError)

      expect(controller.cartsModel.getById).toHaveBeenCalledTimes(1)
    })
  })

  describe('#addProduct', () => {
    beforeEach(() => {
      controller.cartsModel
        .addProducts
        .mockResolvedValue()

      jest.spyOn(controller, 'get')
        .mockResolvedValue({
          _id: new ObjectId(userId),
          products: []
        })
    })

    it('should add a product to the cart', async () => {
      await controller.addProduct(userId, {
        id: productId,
        sellerId,
        quantity: 5
      })

      expect(controller.get).toHaveBeenCalledTimes(1)
      expect(controller.get).toHaveBeenCalledWith(userId)

      expect(controller.cartsModel.addProducts).toHaveBeenCalledTimes(1)
      expect(controller.cartsModel.addProducts).toHaveBeenCalledWith(
        userId,
        [
          {
            id: productId,
            sellerId,
            quantity: 5
          }
        ]
      )

      expect(controller.cartsModel.updateQuantity).toHaveBeenCalledTimes(0)
    })

    it('should update the quantity if the product already exists', async () => {
      controller.get
        .mockResolvedValue({
          products: [
            {
              id: productId,
              name: 'Battery',
              quantity: 5,
              addedAt: new Date()
            }
          ]
        })

      await controller.addProduct(userId, {
        id: productId,
        sellerId,
        quantity: 5
      })

      expect(controller.get).toHaveBeenCalledTimes(1)
      expect(controller.cartsModel.addProducts).toHaveBeenCalledTimes(0)

      expect(controller.cartsModel.updateQuantity).toHaveBeenCalledTimes(1)
      expect(controller.cartsModel.updateQuantity).toHaveBeenCalledWith(
        userId,
        {
          id: productId,
          quantity: 10
        }
      )
    })
  })

  describe('#removeProduct', () => {
    it('should remove a product from the cart', async () => {
      await controller.removeProduct(userId, [
        productId
      ])

      expect(controller.cartsModel.removeProducts).toHaveBeenCalledTimes(1)
      expect(controller.cartsModel.removeProducts).toHaveBeenCalledWith(
        userId,
        [
          productId
        ]
      )
    })

    it('should throw a NotFoundError when the product was not in the cart', async () => {
      controller.cartsModel
        .removeProducts
        .mockResolvedValue(null)

      expect(async () => {
        await controller.removeProduct(userId, [
          productId
        ])
      }).rejects.toThrow(NotFoundError)

      expect(controller.cartsModel.removeProducts).toHaveBeenCalledTimes(1)
    })
  })
})
