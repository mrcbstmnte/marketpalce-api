'use strict'

const {
  ObjectId
} = require('mongodb')

/**
 * Sellers Model
 */
class Sellers {
  /**
   * @param {MongoClient} client - MongoDB client
   * @param {Object} options - Options
   * @param {string} options.databaseName - Database name
   */
  constructor (client, options) {
    this.client = client
    this.db = client.db(options.databaseName)
    this.collection = this.db.collection(Sellers.collectionName)
  }

  /**
   * Collection name
  */
  static get collectionName () {
    return 'sellers'
  }

  /**
   * Creates a seller
   * @param {Object} seller - Seller
   * @param {string} seller.name - Seller name
   * @returns {Promise<Object>} - Created seller
   */
  async create (seller) {
    const now = new Date()

    const results = await this.collection.insertOne({
      name: seller.name,
      deleted: false,
      createdAt: now,
      updatedAt: now
    })

    return results.ops[0]
  }

  /**
   * Retrieves seller of given Id
   * @param {string} sellerId - Seller Id
   * @param {Object} [options] - Options
   * @param {boolean} [options.isActive=true] - Flag to return a seller that is not deleted; false if otherwise
   * @returns {Promise<Object>} - Retrieved seller
   */
  async getById (sellerId, options = {}) {
    const {
      isActive = true
    } = options

    const query = {
      _id: new ObjectId(sellerId)
    }

    if (isActive) {
      query.deleted = false
    }

    return this.collection.findOne(query)
  }

  /**
   * List all sellers
   * @param {Object} [options] - Options
   * @param {boolean} [options.isActive=true] - Flag to return a seller that is not deleted; false if otherwise
   * @returns {Promise<Object[]>} - List of sellers
   */
  async list (options = {}) {
    const {
      isActive = true
    } = options

    const query = {}

    if (isActive) {
      query.deleted = false
    }

    const results = await this.collection.find(query)

    return results.toArray()
  }

  /**
   * Updates seller of given Id
   * @param {string} sellerId - Seller Id
   * @param {Object} updates - Updates Object
   * @param {string} updates.name - New seller name
   * @returns {Promise<Object>} - Updated seller
   */
  async update (sellerId, updates) {
    const result = await this.collection.findOneAndUpdate({
      _id: new ObjectId(sellerId),
      deleted: false
    }, {
      $set: {
        name: updates.name
      },
      $currentDate: {
        updatedAt: true
      }
    }, {
      returnDocument: 'after'
    })

    return result.value
  }

  /**
   * Deletes a seller
   * @param {string} sellerId - Seller Id
   * @returns {Promise<Object>} - Deleted seller
   */
  async delete (sellerId) {
    const result = await this.collection.findOneAndUpdate({
      _id: new ObjectId(sellerId),
      deleted: false
    }, {
      $set: {
        deleted: true
      },
      $currentDate: {
        deletedAt: true
      }
    }, {
      returnDocument: 'after'
    })

    return result.value
  }
}

module.exports = Sellers
