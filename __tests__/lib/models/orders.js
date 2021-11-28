'use strict'

const {
  MongoClient,
  ObjectId
} = require('mongodb')

const Model = require('@models/orders')

describe('Orders Model', () => {
  /**
   * @type {Model}
   */
  let model
  let collection

  const orderId = new ObjectId()
  const userId = '407f191e810c19729de860ff'
  const sellerId = '5e24763552e7fadad71de15b'
  const productId = '407f191e810c19729de860fb'
  const anotherProductId = '5fff191e810c19729de83d45'

  const products = [
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
  ]

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
    it('should create an order', async () => {
      const order = await model.create(userId, products)

      expect(order).toStrictEqual({
        _id: expect.any(ObjectId),
        userId: new ObjectId(userId),
        products,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })
    })
  })

  describe('#getById', () => {
    beforeEach(async () => {
      await collection.insertMany([
        {
          _id: new ObjectId(orderId),
          userId: new ObjectId(userId),
          products,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ])
    })

    it('should get the order of given Id', async () => {
      const order = await model.getById(orderId.toString(), userId)

      expect(order).toStrictEqual({
        _id: orderId,
        userId: new ObjectId(userId),
        products,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })
    })
  })
})
