'use strict'

const {
  MongoClient,
  ObjectId
} = require('mongodb')

const Model = require('@models/products')

describe('Products Model', () => {
  /**
   * @type {Model}
   */
  let model
  let collection

  const sellerId = '407f191e810c19729de860ff'

  const productId = '5e24763552e7fadad71de15b'
  const anotherProductId = '407f191e810c19729de860fb'
  const deletedProductId = '5fff191e810c19729de83d45'

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
    it('should create a product of a seller', async () => {
      const product = await model.create(sellerId, {
        name: 'Fire Hydrant',
        stock: 3
      })

      expect(product).toStrictEqual({
        _id: expect.any(ObjectId),
        sellerId: new ObjectId(sellerId),
        name: 'Fire Hydrant',
        stock: 3,
        deleted: false,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })
    })
  })

  describe('#getById', () => {
    beforeEach(async () => {
      await collection.insertMany([
        {
          _id: new ObjectId(productId),
          sellerId: new ObjectId(sellerId),
          name: 'Fire Truck',
          stock: 1,
          deleted: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: new ObjectId(anotherProductId),
          sellerId: new ObjectId(sellerId),
          name: 'Fire Hydrant',
          stock: 4,
          deleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: new Date()
        }
      ])
    })

    it('should retrieve a product by Id', async () => {
      const product = await model.getById(productId, sellerId)

      expect(product).toStrictEqual({
        _id: new ObjectId(productId),
        sellerId: new ObjectId(sellerId),
        name: 'Fire Truck',
        stock: 1,
        deleted: false,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })
    })
  })

  describe('#list', () => {
    beforeEach(async () => {
      await collection.insertMany([
        {
          _id: new ObjectId(productId),
          sellerId: new ObjectId(sellerId),
          name: 'Fire Truck',
          stock: 1,
          deleted: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: new ObjectId(anotherProductId),
          sellerId: new ObjectId(sellerId),
          name: 'Fire Hydrant',
          stock: 4,
          deleted: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: new ObjectId(deletedProductId),
          sellerId: new ObjectId(sellerId),
          name: 'Glass',
          stock: 0,
          deleted: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: new Date()
        },
        {
          _id: new ObjectId(),
          sellerId: new ObjectId(),
          name: 'Wood',
          stock: 5,
          deleted: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ])
    })

    it('should list all available products', async () => {
      const products = await model.list()

      expect(products).toStrictEqual([
        {
          _id: new ObjectId(productId),
          sellerId: new ObjectId(sellerId),
          name: 'Fire Truck',
          stock: 1,
          deleted: false,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        },
        {
          _id: new ObjectId(anotherProductId),
          sellerId: new ObjectId(sellerId),
          name: 'Fire Hydrant',
          stock: 4,
          deleted: false,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        },
        {
          _id: expect.any(ObjectId),
          sellerId: expect.any(ObjectId),
          name: 'Wood',
          stock: 5,
          deleted: false,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        }
      ])
    })

    it('should list all available products of a specific seller', async () => {
      const products = await model.list({
        sellerId
      })

      expect(products).toStrictEqual([
        {
          _id: new ObjectId(productId),
          sellerId: new ObjectId(sellerId),
          name: 'Fire Truck',
          stock: 1,
          deleted: false,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        },
        {
          _id: new ObjectId(anotherProductId),
          sellerId: new ObjectId(sellerId),
          name: 'Fire Hydrant',
          stock: 4,
          deleted: false,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        }
      ])
    })
  })

  describe('#update', () => {
    beforeEach(async () => {
      await collection.insertMany([
        {
          _id: new ObjectId(productId),
          sellerId: new ObjectId(sellerId),
          name: 'Fire Truck',
          stock: 1,
          deleted: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: new ObjectId(anotherProductId),
          sellerId: new ObjectId(sellerId),
          name: 'Fire Hydrant',
          stock: 4,
          deleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: new Date()
        }
      ])
    })

    it('should update the product name', async () => {
      await model.update(productId, sellerId, {
        name: 'Cool Fire Truck'
      })

      const product = await model.collection.findOne({
        _id: new ObjectId(productId)
      })

      expect(product.name).toStrictEqual('Cool Fire Truck')
      expect(product.updatedAt.valueOf()).toBeGreaterThan(product.createdAt.valueOf())
    })

    it('should update the number of stocks of a product', async () => {
      await model.update(productId, sellerId, {
        stock: 7
      })

      const product = await model.collection.findOne({
        _id: new ObjectId(productId)
      })

      expect(product.stock).toStrictEqual(7)
      expect(product.updatedAt.valueOf()).toBeGreaterThan(product.createdAt.valueOf())
    })

    it('should not perform an update if the product was not found', async () => {
      const product = await model.update(new ObjectId(), sellerId, {
        name: 'Something new'
      })

      expect(product).toStrictEqual(null)
    })

    it('should not perform an update if the seller was not found', async () => {
      const product = await model.update(productId, new ObjectId(), {
        name: 'Something new'
      })

      expect(product).toStrictEqual(null)
    })

    it('should throw an error if no updates are provided', async () => {
      expect(async () => {
        await model.update(productId, sellerId)
      }).rejects.toThrow()
    })
  })

  describe('#delete', () => {
    beforeEach(async () => {
      await collection.insertMany([
        {
          _id: new ObjectId(productId),
          sellerId: new ObjectId(sellerId),
          name: 'Fire Truck',
          stock: 1,
          deleted: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: new ObjectId(anotherProductId),
          sellerId: new ObjectId(sellerId),
          name: 'Fire Hydrant',
          stock: 4,
          deleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: new Date()
        }
      ])
    })

    it('should mark the product as deleted', async () => {
      const product = await model.delete(productId, sellerId)

      expect(product.deleted).toStrictEqual(true)
      expect(product.deletedAt.valueOf()).toBeGreaterThan(product.createdAt.valueOf())
    })

    it('should not delete an already deleted product', async () => {
      const product = await model.delete(deletedProductId, sellerId)

      expect(product).toStrictEqual(null)
    })
  })
})
