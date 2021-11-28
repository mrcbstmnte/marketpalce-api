'use strict'

const {
  ObjectId
} = require('mongodb')

/**
 * Products Model
 */
class Products {
  /**
   * @param {MongoClient} client - MongoDB client
   * @param {Object} options - Options
   * @param {string} options.databaseName - Database name
   */
  constructor (client, options) {
    this.client = client
    this.databaseName = options.databaseName
    this.db = client.db(options.database)
    this.collection = this.db.collection(Products.collectionName)
  }

  /**
   * Collection name
  */
  static get collectionName () {
    return 'products'
  }

  /**
   * Creates a product
   * @param {string} sellerId - Seller Id
   * @param {Object} product - Product
   * @param {string} product.name - Product name
   * @param {number} product.stock - Product stocks
   * @returns {Promise<Object>} - Created product
   */
  async create (sellerId, product) {
    const now = new Date()

    const results = await this.collection.insertOne({
      sellerId: new ObjectId(sellerId),
      name: product.name,
      stock: product.stock,
      deleted: false,
      createdAt: now,
      updatedAt: now
    })

    return results.ops[0]
  }

  /**
   * Retrieves product of given Id from a specific seller
   * @param {string} productId - Product Id
   * @param {string} sellerId - Seller Id
   * @returns {Promise<Object>} - Retrieved product
   */
  async getById (productId, sellerId) {
    return this.collection.findOne({
      _id: new ObjectId(productId),
      sellerId: new ObjectId(sellerId)
    })
  }

  /**
   * List all products
   * @param {Object} [options] - Options
   * @param {boolean} [options.sellerId] - Seller Id
   * @returns {Promise<Object[]>} - List of products
   */
  async list (options = {}) {
    const {
      sellerId
    } = options

    const query = {
      deleted: false
    }

    if (sellerId !== undefined) {
      query.sellerId = new ObjectId(sellerId)
    }

    const results = await this.collection.find(query)

    return results.toArray()
  }

  /**
   * Updates the product of given Id from a specific seller
   * @param {string} productId - Product Id
   * @param {string} sellerId - Seller Id
   * @param {Object} product - Updates
   * @param {string} product.name - Product's new name
   * @param {number} product.stock - New stock
   * @returns {Promise<Object>} - Updated product
   */
  async update (productId, sellerId, product = {}) {
    const {
      name,
      stock
    } = product

    const set = {}

    let hasUpdates = false

    if (name !== undefined) {
      set.name = name

      hasUpdates = true
    }

    if (stock !== undefined) {
      set.stock = stock

      hasUpdates = true
    }

    if (!hasUpdates) {
      throw new Error('No updates to be performed')
    }

    const result = await this.collection.findOneAndUpdate({
      _id: new ObjectId(productId),
      sellerId: new ObjectId(sellerId),
      deleted: false
    }, {
      $set: set,
      $currentDate: {
        updatedAt: true
      }
    }, {
      returnDocument: 'after'
    })

    return result.value
  }

  /**
   * Deletes a product
   * @param {string} productId - Product Id
   * @param {string} sellerId - Seller Id
   * @returns {Promise<Object>} - Deleted product
   */
  async delete (productId, sellerId) {
    const result = await this.collection.findOneAndUpdate({
      _id: new ObjectId(productId),
      sellerId: new ObjectId(sellerId),
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

module.exports = Products
