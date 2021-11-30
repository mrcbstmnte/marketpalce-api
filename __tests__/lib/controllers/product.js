'use strict'

const {
  MongoClient,
  ObjectId
} = require('mongodb')

const ProductsModel = require('@models/products')
const SellersModel = require('@models/sellers')
const Controller = require('@lib/controllers/product')

const { NotFoundError } = require('@/lib/errors')

jest.mock('@models/products')
jest.mock('@models/sellers')

describe('Product Controller', () => {
  /**
   * @type {Controller}
   */
  let controller

  /**
   * @type {MongoClient}
   */
  let mongoClient

  const sellerId = '407f191e810c19729de860ff'
  const productId = '5e24763552e7fadad71de15b'
  const anotherProduct = '5e24763552e7fadad71de15b'

  beforeAll(async () => {
    mongoClient = new MongoClient('mongodb://localhost:27017', {
      useUnifiedTopology: true,
      writeConcern: 'majority',
      ignoreUndefined: true
    })

    await mongoClient.connect()

    controller = new Controller({
      productsModel: new ProductsModel(mongoClient, {
        database: 'test'
      }),
      sellersModel: new SellersModel(mongoClient, {
        database: 'test'
      })
    })
  })

  describe('@Constructor', () => {
    it('should have an instance of products model', () => {
      expect(controller.productsModel).toBeInstanceOf(ProductsModel)
    })

    it('should have an instance of sellers model', () => {
      expect(controller.sellersModel).toBeInstanceOf(SellersModel)
    })

    it('should throw an error if products model is not provided', () => {
      expect(() => {
        return new Controller()
      }).toThrow()
    })

    it('should throw an error if sellers model is not provided', () => {
      expect(() => {
        return new Controller({
          productsModel: new ProductsModel(mongoClient, {
            database: 'test'
          })
        })
      }).toThrow()
    })
  })

  describe('#formatProduct', () => {
    it('should format the given product as response', () => {
      const product = Controller.formatProduct({
        _id: new ObjectId(productId),
        sellerId: new ObjectId(sellerId),
        name: 'Battery',
        stock: 5,
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      expect(product).toStrictEqual({
        id: productId,
        sellerId,
        name: 'Battery',
        stock: 5,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })
    })
  })

  describe('#create', () => {
    beforeEach(() => {
      controller.sellersModel
        .getById
        .mockResolvedValue({
          _id: new ObjectId(sellerId)
        })
    })

    it('should create a product for a seller', async () => {
      await controller.create(sellerId, {
        name: 'Battery',
        stock: 5
      })

      expect(controller.sellersModel.getById).toHaveBeenCalledTimes(1)
      expect(controller.sellersModel.getById).toHaveBeenCalledWith(sellerId)

      expect(controller.productsModel.create).toHaveBeenCalledTimes(1)
      expect(controller.productsModel.create).toHaveBeenCalledWith(
        sellerId,
        {
          name: 'Battery',
          stock: 5
        }
      )
    })

    it('should throw an error when the seller is not found', async () => {
      controller.sellersModel
        .getById
        .mockResolvedValue(null)

      await expect(async () => {
        await controller.create(sellerId, {
          name: 'Battery',
          stock: 5
        })
      }).rejects.toThrow(NotFoundError)

      expect(controller.sellersModel.getById).toHaveBeenCalledTimes(1)
      expect(controller.productsModel.create).toHaveBeenCalledTimes(0)
    })
  })

  describe('#get', () => {
    const product = {
      _id: new ObjectId(productId),
      sellerId: new ObjectId(sellerId),
      name: 'Battery',
      stock: 5,
      deleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    beforeEach(() => {
      controller.productsModel
        .getById
        .mockResolvedValue(product)

      jest.spyOn(Controller, 'formatProduct')
    })

    it('should get the product', async () => {
      const product = await controller.get(productId, sellerId)

      expect(product).toStrictEqual({
        id: productId,
        sellerId,
        name: 'Battery',
        stock: 5,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })

      expect(controller.productsModel.getById).toHaveBeenCalledTimes(1)
      expect(controller.productsModel.getById).toHaveBeenCalledWith(
        productId,
        sellerId
      )

      expect(Controller.formatProduct).toHaveBeenCalledTimes(1)
      expect(Controller.formatProduct).toHaveBeenCalledWith(product)
    })

    it('should throw a NotFoundError when the product was not found', async () => {
      controller.productsModel
        .getById
        .mockResolvedValue(null)

      await expect(async () => {
        await controller.get(productId, sellerId)
      }).rejects.toThrow(NotFoundError)

      expect(controller.productsModel.getById).toHaveBeenCalledTimes(1)
      expect(Controller.formatProduct).toHaveBeenCalledTimes(0)
    })
  })

  describe('#list', () => {
    beforeEach(() => {
      controller.productsModel
        .list
        .mockResolvedValue([
          {
            _id: new ObjectId(productId),
            sellerId: new ObjectId(sellerId),
            name: 'Battery',
            stock: 5,
            deleted: false,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            _id: new ObjectId(anotherProduct),
            sellerId: new ObjectId(sellerId),
            name: 'Battery',
            stock: 5,
            deleted: false,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ])

      jest.spyOn(Controller, 'formatProduct')
    })

    it('should list all products of a seller', async () => {
      const products = await controller.list(sellerId)

      expect(products).toStrictEqual([
        {
          id: productId,
          sellerId,
          name: 'Battery',
          stock: 5,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        },
        {
          id: anotherProduct,
          sellerId,
          name: 'Battery',
          stock: 5,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        }
      ])

      expect(controller.productsModel.list).toHaveBeenCalledTimes(1)
      expect(controller.productsModel.list).toHaveBeenCalledWith({
        sellerId
      })

      expect(Controller.formatProduct).toHaveBeenCalledTimes(2)
    })
  })

  describe('#update', () => {
    it('should update an existing product', async () => {
      await controller.update(productId, sellerId, {
        name: 'Super Battery'
      })

      expect(controller.productsModel.update).toHaveBeenCalledTimes(1)
      expect(controller.productsModel.update).toHaveBeenCalledWith(
        productId,
        sellerId,
        {
          name: 'Super Battery'
        }
      )
    })

    it('should throw a NotFoundError when the product was not found', async () => {
      controller.productsModel
        .update
        .mockResolvedValue(null)

      await expect(async () => {
        await controller.update(productId, sellerId, {
          name: 'Super Battery'
        })
      }).rejects.toThrow(NotFoundError)

      expect(controller.productsModel.update).toHaveBeenCalledTimes(1)
    })
  })

  describe('#delete', () => {
    it('should delete a given product', async () => {
      await controller.delete(productId, sellerId)

      expect(controller.productsModel.delete).toHaveBeenCalledTimes(1)
      expect(controller.productsModel.delete).toHaveBeenCalledWith(
        productId,
        sellerId
      )
    })

    it('should throw an error if the product trying to delete does not exist', async () => {
      controller.productsModel
        .delete
        .mockResolvedValue(null)

      await expect(async () => {
        await controller.delete(productId, sellerId)
      }).rejects.toThrow(NotFoundError)

      expect(controller.productsModel.delete).toHaveBeenCalledTimes(1)
    })
  })
})
