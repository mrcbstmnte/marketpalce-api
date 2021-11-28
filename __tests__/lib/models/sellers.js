'use strict'

const {
  MongoClient,
  ObjectId
} = require('mongodb')

const Model = require('@models/sellers')

describe('Sellers Model', () => {
  /**
   * @type {Model}
   */
  let model
  let collection

  const sellerId = '407f191e810c19729de860ff'
  const anotherSellerId = '5e24763552e7fadad71de15b'
  const deletedSellerId = '407f191e810c19729de860fb'

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
    it('should create new a seller', async () => {
      const seller = await model.create({
        name: 'Seller 1'
      })

      expect(seller).toStrictEqual({
        _id: expect.any(ObjectId),
        name: 'Seller 1',
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
          _id: new ObjectId(sellerId),
          name: 'Seller 2',
          deleted: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: new ObjectId(deletedSellerId),
          name: 'Deleted Seller',
          deleted: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: new Date()
        }
      ])
    })

    it('should retrieve a seller by Id', async () => {
      const seller = await model.getById(sellerId)

      expect(seller).toStrictEqual({
        _id: new ObjectId(sellerId),
        name: 'Seller 2',
        deleted: false,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })
    })

    it('should retrieve a seller if `isActive` flag is set to `false`', async () => {
      const seller = await model.getById(deletedSellerId, {
        isActive: false
      })

      expect(seller).toStrictEqual({
        _id: new ObjectId(deletedSellerId),
        name: 'Deleted Seller',
        deleted: true,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        deletedAt: expect.any(Date)
      })
    })

    it('should return `null` if the seller is deleted', async () => {
      const seller = await model.getById(deletedSellerId)

      expect(seller).toStrictEqual(null)
    })
  })

  describe('#list', () => {
    beforeEach(async () => {
      await collection.insertMany([
        {
          _id: new ObjectId(sellerId),
          name: 'Seller 2',
          deleted: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: new ObjectId(deletedSellerId),
          name: 'Deleted Seller',
          deleted: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: new Date()
        },
        {
          _id: new ObjectId(anotherSellerId),
          name: 'Another Seller',
          deleted: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ])
    })

    it('should list all sellers', async () => {
      const sellers = await model.list({
        isActive: false
      })

      expect(sellers).toStrictEqual([
        {
          _id: new ObjectId(sellerId),
          name: 'Seller 2',
          deleted: false,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        },
        {
          _id: new ObjectId(deletedSellerId),
          name: 'Deleted Seller',
          deleted: true,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          deletedAt: expect.any(Date)
        },
        {
          _id: new ObjectId(anotherSellerId),
          name: 'Another Seller',
          deleted: false,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        }
      ])
    })

    it('should list all active sellers', async () => {
      const sellers = await model.list()

      expect(sellers).toStrictEqual([
        {
          _id: new ObjectId(sellerId),
          name: 'Seller 2',
          deleted: false,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        },
        {
          _id: new ObjectId(anotherSellerId),
          name: 'Another Seller',
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
          _id: new ObjectId(sellerId),
          name: 'Seller 2',
          deleted: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: new ObjectId(deletedSellerId),
          name: 'Deleted Seller',
          deleted: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: new Date()
        }
      ])
    })

    it('should update a seller', async () => {
      await model.update(sellerId, {
        name: 'New Seller Name'
      })

      const seller = await model.collection.findOne({
        _id: new ObjectId(sellerId)
      })

      expect(seller.name).toStrictEqual('New Seller Name')
      expect(seller.updatedAt.valueOf()).toBeGreaterThan(seller.createdAt.valueOf())
    })

    it('should not perform update if the seller was not found', async () => {
      const seller = await model.update(new ObjectId(), {
        name: 'Something seller'
      })

      expect(seller).toStrictEqual(null)
    })
  })

  describe('#delete', () => {
    beforeEach(async () => {
      await collection.insertMany([
        {
          _id: new ObjectId(sellerId),
          name: 'Seller 2',
          deleted: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: new ObjectId(deletedSellerId),
          name: 'Deleted Seller',
          deleted: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: new Date()
        }
      ])
    })

    it('should mark a seller as deleted', async () => {
      const seller = await model.delete(sellerId)

      expect(seller.deleted).toStrictEqual(true)
      expect(seller.deletedAt.valueOf()).toBeGreaterThan(seller.createdAt.valueOf())
    })

    it('should not delete an already deleted seller', async () => {
      const seller = await model.delete(deletedSellerId)

      expect(seller).toStrictEqual(null)
    })
  })
})
