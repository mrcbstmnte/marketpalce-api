'use strict'

const {
  MongoClient,
  ObjectId
} = require('mongodb')

const UsersModel = require('@models/users')
const CartsModel = require('@models/carts')
const Controller = require('@lib/controllers/user')

jest.mock('@models/users')
jest.mock('@models/carts')

describe('User Controller', () => {
  /**
   * @type {Controller}
   */
  let controller

  /**
   * @type {MongoClient}
   */
  let mongoClient

  const userId = '407f191e810c19729de860ff'

  beforeAll(async () => {
    mongoClient = new MongoClient('mongodb://localhost:27017', {
      useUnifiedTopology: true,
      writeConcern: 'majority',
      ignoreUndefined: true
    })

    await mongoClient.connect()

    controller = new Controller({
      usersModel: new UsersModel(mongoClient, {
        database: 'test'
      }),
      cartsModel: new CartsModel(mongoClient, {
        database: 'test'
      })
    })
  })

  describe('@Constructor', () => {
    it('should have an instance of users model', () => {
      expect(controller.usersModel).toBeInstanceOf(UsersModel)
    })

    it('should have an instance of carts model', () => {
      expect(controller.cartsModel).toBeInstanceOf(CartsModel)
    })

    it('should throw an error if users model is not provided', () => {
      expect(() => {
        return new Controller()
      }).toThrow()
    })

    it('should throw an error if carts model is not provided', () => {
      expect(() => {
        return new Controller({
          usersModel: new UsersModel(mongoClient, {
            databaseName: 'test'
          })
        })
      }).toThrow()
    })
  })

  describe('#create', () => {
    beforeEach(() => {
      controller.usersModel
        .create
        .mockResolvedValue({
          _id: new ObjectId(userId)
        })

      controller.cartsModel
        .create
        .mockResolvedValue()
    })

    it('should create a new user together with an empty cart', async () => {
      await controller.create({
        email: 'test@gmail.com',
        password: 'password',
        name: 'Some guy',
        role: 'user'
      })

      expect(controller.usersModel.create).toHaveBeenCalledTimes(1)
      expect(controller.usersModel.create).toHaveBeenCalledWith({
        email: 'test@gmail.com',
        password: 'password',
        role: 'user',
        name: 'Some guy'
      })

      expect(controller.cartsModel.create).toHaveBeenCalledTimes(1)
      expect(controller.cartsModel.create).toHaveBeenCalledWith(userId)
    })
  })
})
