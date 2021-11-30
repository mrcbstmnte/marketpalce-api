'use strict'

const {
  ObjectId
} = require('mongodb')

const { DuplicateKeyError } = require('@lib/errors')

/**
 * Carts Model
 */
class Carts {
  /**
   * @param {MongoClient} client - MongoDB client
   * @param {Object} options - Options
   * @param {string} options.databaseName - Database name
   */
  constructor (client, options) {
    this.client = client
    this.db = client.db(options.databaseName)
    this.collection = this.db.collection(Carts.collectionName)
  }

  /**
   * Collection name
  */
  static get collectionName () {
    return 'carts'
  }

  /**
   * Creates a cart for a user
   * @param {string} userId - User Id
   * @returns {Promise<Object>} - Cart created
   */
  async create (userId) {
    const now = new Date()

    try {
      const result = await this.collection.insertOne({
        _id: new ObjectId(userId),
        products: [],
        createdAt: now,
        updatedAt: now
      })

      return result.ops[0]
    } catch (error) {
      if (error.code === 11000) {
        throw new DuplicateKeyError('duplicate_user_cart')
      }

      throw error
    }
  }

  /**
   * Retrieves the cart of the user
   * @param {string} userId - User Id
   * @returns {Promise<Object>} - User's cart
   */
  async getById (userId) {
    return this.collection.findOne({
      _id: new ObjectId(userId)
    })
  }

  /**
   * Checks if the product exists in the cart
   * @param {string} userId - User Id
   * @param {string} productId - Product Id
   * @returns {Promise<boolean>} - Flag that determines if the product exists
   */
  async productExists (userId, productId) {
    const result = await this.collection.findOne({
      _id: new ObjectId(userId),
      'products.id': productId
    })

    return result !== null
  }

  /**
   * Adds products to the cart
   * @param {string} userId - User Id
   * @param {Object[]} products - Product to be added
   * @param {string} products[].id - Product Id
   * @param {string} products[].sellerId - Seller Id
   * @param {number} products[].quantity - Number of products to be added
   * @returns {Promise<Object>} - Added product
   */
  async addProducts (userId, products) {
    const now = new Date()

    const result = await this.collection.findOneAndUpdate({
      _id: new ObjectId(userId)
    }, {
      $push: {
        products: {
          $each: products.map((product) => {
            product.addedAt = now

            return product
          })
        }
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
   * Removes products from the cart
   * @param {string} userId - User Id
   * @param {string[]} productIds - Product Ids
   * @returns {Promise<Object>} -
   */
  async removeProducts (userId, productIds) {
    const result = await this.collection.findOneAndUpdate({
      _id: new ObjectId(userId),
      'products.id': {
        $in: productIds
      }
    }, {
      $pull: {
        products: {
          id: {
            $in: productIds
          }
        }
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
   * Updates quantity of a certain product
   * @param {string} userId - User Id
   * @param {Object} product - Product
   * @param {string} product.id - Product Id
   * @param {number} product.quantity - Product quantity
   * @returns {Promise<Object>} - Updated product quantity
   */
  async updateQuantity (userId, product) {
    const result = await this.collection.findOneAndUpdate({
      _id: new ObjectId(userId),
      'products.id': product.id
    }, {
      $set: {
        'products.$.quantity': product.quantity
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
   * Empties the cart
   * @param {string} userId - User Id
   * @returns {Promise<void>} - Cart emptied
   */
  async emptyCart (userId) {
    await this.collection.findOneAndUpdate({
      _id: new ObjectId(userId)
    }, {
      $set: {
        products: []
      },
      $currentDate: {
        updatedAt: true
      }
    }, {
      returnDocument: 'after'
    })
  }
}

module.exports = Carts
