'use strict'

const {
  ObjectId
} = require('mongodb')

/**
 * Orders Model
 */
class Orders {
  /**
   * @param {MongoClient} client - MongoDB client
   * @param {Object} options - Options
   * @param {string} options.databaseName - Database name
   */
  constructor (client, options) {
    this.client = client
    this.databaseName = options.databaseName
    this.db = client.db(options.database)
    this.collection = this.db.collection(Orders.collectionName)
  }

  /**
   * Collection name
  */
  static get collectionName () {
    return 'sellers'
  }

  /**
   * Creates an order for a user
   * @param {string} userId - User Id
   * @param {Object[]} products - Products to be added on the order
   * @returns {Promise<Object>} - Order created
   */
  async create (userId, products) {
    const now = new Date()

    const result = await this.collection.insertOne({
      userId: new ObjectId(userId),
      products,
      createdAt: now,
      updatedAt: now
    })

    return result.ops[0]
  }

  /**
   * Retrieves the order of the user
   * @param {string} orderId - Order Id
   * @param {string} userId - User Id
   * @returns {Promise<Object>} - User's order
   */
  async getById (orderId, userId) {
    return this.collection.findOne({
      _id: new ObjectId(orderId),
      userId: new ObjectId(userId)
    })
  }
}

module.exports = Orders
