'use strict'

const { NotFoundError } = require('../errors')

/**
 * Seller controller
 */
class User {
  /**
   * @param {Object} dependencies - Dependencies
   * @param {Object} dependencies.sellersModel - Sellers Model
   */
  constructor (dependencies = {}) {
    const {
      sellersModel
    } = dependencies

    if (sellersModel === undefined) {
      throw new Error('sellersModel should be provided')
    }

    this.sellersModel = sellersModel
  }

  /**
   * Formats the given seller object as response
   * @param {Object} seller - Seller
   * @param {Object} seller._id - Seller Id
   * @param {string} seller.name - Seller name
   * @param {boolean} seller.deleted - Flag that indicates if the seller is deleted
   * @param {Date} seller.createdAt - When the seller was created
   * @param {Date} seller.updatedAt - When the seller was updated
   * @returns {Object} - Formatted seller
   */
  static formatSeller (seller) {
    seller.id = seller._id.toString()

    delete seller._id
    delete seller.deleted

    return seller
  }

  /**
   * Creates a seller
   * @param {Object} seller - Seller
   * @param {string} seller.name - Seller name
   * @returns {Promise<void>} - Created the seller
   */
  async create (seller) {
    await this.sellersModel.create({
      name: seller.name
    })
  }

  /**
   * Retrieves a seller
   * @param {string} sellerId - Seller Id
   * @returns {Promise<Object>} - Retrieved seller
   */
  async get (sellerId) {
    const seller = await this.sellersModel.getById(sellerId)

    if (seller === null) {
      throw new NotFoundError('seller')
    }

    return User.formatSeller(seller)
  }

  /**
   * List all the available sellers
   * @returns {Promise<Object[]>} - List of sellers
   */
  async list () {
    const sellers = await this.sellersModel.list()

    return sellers.map(User.formatSeller)
  }

  /**
   * Updates the seller
   * @param {string} sellerId - Seller Id
   * @param {Object} updates - Updates
   * @param {string} updates.name - Seller name
   * @returns {Promise<void>} - Updated the seller
   */
  async update (sellerId, updates) {
    const updatedSeller = await this.sellersModel.update(sellerId, updates)

    if (updatedSeller === null) {
      throw new NotFoundError('seller')
    }
  }

  /**
   * Deletes a seller of given Id
   * @param {string} sellerId - Seller Id
   * @returns {Promise<void>} - Deleted seller
   */
  async delete (sellerId) {
    const deletedSeller = await this.sellersModel.delete(sellerId)

    if (deletedSeller === null) {
      throw new NotFoundError('seller')
    }
  }
}

module.exports = User
