'use strict'

const {
  MongoClient,
  ObjectId
} = require('mongodb')

const Model = require('@models/users')

describe('Users Model', () => {
  /**
   * @type {Model}
   */
  let model
  let collection

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

    await model.setupCollection()
  })

  beforeEach(async () => {
    await collection.deleteMany()
  })

  describe('#create', () => {
    it('should create a new user', async () => {
      const user = await model.create({
        name: 'User A',
        role: 'admin',
        email: 'test@gmail.com',
        password: 'password'
      })

      expect(user).toStrictEqual({
        _id: expect.any(ObjectId),
        name: 'User A',
        role: 'admin',
        email: 'test@gmail.com',
        password: 'password',
        deleted: false,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })
    })

    it('should throw an error if the email already exists', async () => {
      await model.create({
        name: 'User A',
        role: 'admin',
        email: 'test@gmail.com',
        password: 'password'
      })

      expect(async () => {
        await model.create({
          name: 'User A',
          role: 'admin',
          email: 'test@gmail.com',
          password: 'password'
        })
      }).rejects.toThrow(new Error('duplicate_email'))
    })
  })
})
