'use strict'

const {
  MongoClient,
  ObjectId
} = require('mongodb')

const Model = require('@models/carts')

describe('Carts Model', () => {
  /**
   * @type {Model}
   */
  let model
  let collection

  const userId = '407f191e810c19729de860ff'
  const sellerId = '5e24763552e7fadad71de15b'
  const productId = '407f191e810c19729de860fb'
  const anotherProductId = '5fff191e810c19729de83d45'

  beforeAll(async () => {
    const mongoClient = new MongoClient('mongodb://localhost:27017', {
      useUnifiedTopology: true,
      writeConcern: 'majority',
      ignoreUndefined: true
    })

    await mongoClient.connect()

    model = new Model(mongoClient, {
      databaseName: 'test'
    })

    collection = model.collection
  })

  beforeEach(async () => {
    await collection.deleteMany()
  })

  describe('#create', () => {
    it('should create an empty cart of the user', async () => {
      const cart = await model.create(userId)

      expect(cart).toStrictEqual({
        _id: new ObjectId(userId),
        products: [],
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })
    })

    it('should throw an error when creating multiple carts for a user', async () => {
      await model.create(userId)

      expect(async () => {
        await model.create(userId)
      }).rejects.toThrow()
    })
  })

  describe('#getById', () => {
    beforeEach(async () => {
      await collection.insertMany([
        {
          _id: new ObjectId(userId),
          products: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ])
    })

    it('should get the cart of the user', async () => {
      const cart = await model.getById(userId)

      expect(cart).toStrictEqual({
        _id: new ObjectId(userId),
        products: [],
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })
    })
  })

  describe('#productExists', () => {
    beforeEach(async () => {
      await collection.insertMany([
        {
          _id: new ObjectId(userId),
          products: [
            {
              id: productId,
              sellerId,
              quantity: 5
            }
          ],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ])
    })

    it('should check if the product already exists in the cart', async () => {
      let exists = await model.productExists(userId, productId)

      expect(exists).toEqual(true)

      exists = await model.productExists(userId, anotherProductId)

      expect(exists).toEqual(false)
    })
  })

  describe('#addProducts', () => {
    beforeEach(async () => {
      await collection.insertMany([
        {
          _id: new ObjectId(userId),
          products: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ])
    })

    it('should add a product to the cart', async () => {
      await model.addProducts(userId, [
        {
          id: productId,
          sellerId,
          quantity: 5
        }
      ])

      const cart = await model.collection.findOne({
        _id: new ObjectId(userId)
      })

      expect(cart.products).toStrictEqual([
        {
          id: productId,
          sellerId,
          quantity: 5,
          addedAt: expect.any(Date)
        }
      ])
      expect(cart.updatedAt.valueOf()).toBeGreaterThan(cart.createdAt.valueOf())
    })

    it('should add multiple products to the cart', async () => {
      await model.addProducts(userId, [
        {
          id: productId,
          sellerId,
          quantity: 5
        },
        {
          id: anotherProductId,
          sellerId,
          quantity: 6
        }
      ])

      const cart = await model.collection.findOne({
        _id: new ObjectId(userId)
      })

      expect(cart.products).toStrictEqual([
        {
          id: productId,
          sellerId,
          quantity: 5,
          addedAt: expect.any(Date)
        },
        {
          id: anotherProductId,
          sellerId,
          quantity: 6,
          addedAt: expect.any(Date)
        }
      ])
      expect(cart.updatedAt.valueOf()).toBeGreaterThan(cart.createdAt.valueOf())
    })
  })

  describe('#removeProducts', () => {
    beforeEach(async () => {
      await collection.insertMany([
        {
          _id: new ObjectId(userId),
          products: [
            {
              id: productId,
              sellerId,
              quantity: 5,
              addedAt: new Date()
            },
            {
              id: anotherProductId,
              sellerId,
              quantity: 6,
              addedAt: new Date()
            }
          ],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ])
    })

    it('should remove a product from the cart', async () => {
      await model.removeProducts(userId, [
        productId
      ])

      const cart = await model.collection.findOne({
        _id: new ObjectId(userId)
      })

      expect(cart.products).toStrictEqual([
        {
          id: anotherProductId,
          sellerId,
          quantity: 6,
          addedAt: expect.any(Date)
        }
      ])
      expect(cart.updatedAt.valueOf()).toBeGreaterThan(cart.createdAt.valueOf())
    })

    it('should remove multiple products from the cart', async () => {
      await model.removeProducts(userId, [
        productId,
        anotherProductId
      ])

      const cart = await model.collection.findOne({
        _id: new ObjectId(userId)
      })

      expect(cart.products).toStrictEqual([])
      expect(cart.updatedAt.valueOf()).toBeGreaterThan(cart.createdAt.valueOf())
    })

    it('should return `null` if the products to remove does not exist', async () => {
      const cart = await model.removeProducts(userId, [
        new ObjectId().toString(),
        new ObjectId().toString()
      ])

      expect(cart).toStrictEqual(null)
    })
  })

  describe('#updateQuantity', () => {
    beforeEach(async () => {
      await collection.insertMany([
        {
          _id: new ObjectId(userId),
          products: [
            {
              id: productId,
              sellerId,
              quantity: 5,
              addedAt: new Date()
            }
          ],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ])
    })

    it('should update the quantity of a specific product', async () => {
      await model.updateQuantity(userId, {
        id: productId,
        quantity: 16
      })

      const cart = await model.collection.findOne({
        _id: new ObjectId(userId)
      })

      expect(cart.products).toStrictEqual([
        {
          id: productId,
          sellerId,
          quantity: 16,
          addedAt: expect.any(Date)
        }
      ])
      expect(cart.updatedAt.valueOf()).toBeGreaterThan(cart.createdAt.valueOf())
    })
  })

  describe('#emptyCart', () => {
    beforeEach(async () => {
      await collection.insertMany([
        {
          _id: new ObjectId(userId),
          products: [
            {
              id: productId,
              sellerId,
              quantity: 5,
              addedAt: new Date()
            }
          ],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ])
    })

    it('should empty the cart', async () => {
      await model.emptyCart(userId)

      const cart = await model.collection.findOne({
        _id: new ObjectId(userId)
      })

      expect(cart.products).toStrictEqual([])
    })
  })
})
