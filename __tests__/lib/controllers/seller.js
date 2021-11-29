'use strict'

const {
  MongoClient,
  ObjectId
} = require('mongodb')

const SellersModel = require('@models/sellers')
const Controller = require('@lib/controllers/seller')

const {
  NotFoundError
} = require('@lib/errors')

jest.mock('@models/sellers')

describe('Seller Controller', () => {
  /**
   * @type {Controller}
   */
  let controller

  const sellerId = '407f191e810c19729de860ff'
  const anotherSellerId = '5e24763552e7fadad71de15b'

  beforeAll(async () => {
    const mongoClient = new MongoClient('mongodb://localhost:27017', {
      useUnifiedTopology: true,
      writeConcern: 'majority',
      ignoreUndefined: true
    })

    await mongoClient.connect()

    controller = new Controller({
      sellersModel: new SellersModel(mongoClient, {
        database: 'test'
      })
    })
  })

  describe('@Constructor', () => {
    it('should have an instance of sellers model', () => {
      expect(controller.sellersModel).toBeInstanceOf(SellersModel)
    })

    it('should throw an error if sellers model is not provided', () => {
      expect(() => {
        return new Controller()
      }).toThrow()
    })
  })

  describe('#formatSeller', () => {
    it('should format the given seller as response', () => {
      const seller = Controller.formatSeller({
        _id: new ObjectId(sellerId),
        name: 'Seller 1',
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      expect(seller).toStrictEqual({
        id: sellerId,
        name: 'Seller 1',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })
    })
  })

  describe('#create', () => {
    it('should create a seller', async () => {
      await controller.create({
        name: 'Seller 1'
      })

      expect(controller.sellersModel.create).toHaveBeenCalledTimes(1)
      expect(controller.sellersModel.create).toHaveBeenCalledWith({
        name: 'Seller 1'
      })
    })
  })

  describe('#get', () => {
    const seller = {
      _id: new ObjectId(sellerId),
      name: 'Seller 1',
      deleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    beforeEach(() => {
      controller.sellersModel
        .getById
        .mockResolvedValue(seller)

      jest.spyOn(Controller, 'formatSeller')
    })

    it('should get a seller', async () => {
      const seller = await controller.get(sellerId)

      expect(seller).toStrictEqual({
        id: sellerId,
        name: 'Seller 1',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })

      expect(controller.sellersModel.getById).toHaveBeenCalledTimes(1)
      expect(controller.sellersModel.getById).toHaveBeenCalledWith(sellerId)

      expect(Controller.formatSeller).toHaveBeenCalledTimes(1)
      expect(Controller.formatSeller).toHaveBeenCalledWith(seller)
    })

    it('should throw NotFoundError if the seller is not found', async () => {
      controller.sellersModel
        .getById
        .mockResolvedValue(null)

      expect(async () => {
        await controller.get(sellerId)
      }).rejects.toThrow(NotFoundError)

      expect(controller.sellersModel.getById).toHaveBeenCalledTimes(1)
      expect(Controller.formatSeller).toHaveBeenCalledTimes(0)
    })
  })

  describe('#list', () => {
    beforeEach(() => {
      controller.sellersModel
        .list
        .mockResolvedValue([
          {
            _id: new ObjectId(sellerId),
            name: 'Seller 1',
            deleted: false,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            _id: new ObjectId(anotherSellerId),
            name: 'Seller 2',
            deleted: false,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ])

      jest.spyOn(Controller, 'formatSeller')
    })

    it('should list all the sellers', async () => {
      const sellers = await controller.list()

      expect(sellers).toStrictEqual([
        {
          id: sellerId,
          name: 'Seller 1',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        },
        {
          id: anotherSellerId,
          name: 'Seller 2',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        }
      ])

      expect(controller.sellersModel.list).toHaveBeenCalledTimes(1)
      expect(Controller.formatSeller).toHaveBeenCalledTimes(2)
    })
  })

  describe('#update', () => {
    it('should update an existing seller', async () => {
      await controller.update(sellerId, {
        name: 'Seller 3'
      })

      expect(controller.sellersModel.update).toHaveBeenCalledTimes(1)
      expect(controller.sellersModel.update).toHaveBeenCalledWith(
        sellerId,
        {
          name: 'Seller 3'
        }
      )
    })

    it('should throw a NotFoundError if the seller was not found', async () => {
      controller.sellersModel
        .update
        .mockResolvedValue(null)

      expect(async () => {
        await controller.update(sellerId, {
          name: 'Seller 3'
        })
      }).rejects.toThrow(NotFoundError)

      expect(controller.sellersModel.update).toHaveBeenCalledTimes(1)
    })
  })

  describe('#delete', () => {
    it('should delete an existing seller', async () => {
      await controller.delete(sellerId)

      expect(controller.sellersModel.delete).toHaveBeenCalledTimes(1)
      expect(controller.sellersModel.delete).toHaveBeenCalledWith(sellerId)
    })

    it('should throw a NotFoundError if the seller does not exist', async () => {
      controller.sellersModel
        .delete
        .mockResolvedValue(null)

      expect(async () => {
        await controller.delete(sellerId)
      }).rejects.toThrow(NotFoundError)

      expect(controller.sellersModel.delete).toHaveBeenCalledTimes(1)
    })
  })
})
