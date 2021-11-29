'use strict'

const { NotFoundError } = require('../errors')

/**
 * Product Controller
 */
class Product {
  /**
   * @param {Object} dependencies - Dependencies
   * @param {Object} dependencies.productsModel - Products Model
   * @param {Object} dependencies.sellersModel - Sellers Model
   */
  constructor (dependencies = {}) {
    const {
      productsModel,
      sellersModel
    } = dependencies

    if (productsModel === undefined) {
      throw new Error('productsModel should be provided')
    }

    if (sellersModel === undefined) {
      throw new Error('sellersModel should be provided')
    }

    this.productsModel = productsModel
    this.sellersModel = sellersModel
  }

  /**
   * Formats product for response
   * @param {Object} product - Product
   * @param {Object} product._id - Product Id
   * @param {Object} product.sellerId - Seller Id
   * @param {string} product.name - Product name
   * @param {number} product.stock - Product stocks
   * @param {boolean} product.deleted - Flag that indicates if the product is deleted
   * @param {Date} product.createdAt - Date when the product was created
   * @param {Date} product.updatedAt - Date when the product was updated
   * @returns {Object} - Formatted product
   */
  static formatProduct (product) {
    product.id = product._id.toString()
    product.sellerId = product.sellerId.toString()

    delete product._id
    delete product.deleted

    return product
  }

  /**
   * Creates a product for the given seller
   * @param {string} sellerId - Seller Id
   * @param {Object} product - Product
   * @param {string} product.name - Product name
   * @param {string} product.stock - Number of stocks
   * @returns {Promise<void>} - Created product
   */
  async create (sellerId, product) {
    const seller = await this.sellersModel.getById(sellerId)

    if (seller === null) {
      throw new NotFoundError('seller')
    }

    await this.productsModel.create(sellerId, {
      name: product.name,
      stock: product.stock
    })
  }

  /**
   * Retrieves a product of a seller
   * @param {string} productId - Product Id
   * @param {string} sellerId - Seller Id
   * @returns {Promise<Object>} - Retrieved product
   */
  async get (productId, sellerId) {
    const product = await this.productsModel.getById(productId, sellerId)

    if (product === null) {
      throw new NotFoundError('product')
    }

    return Product.formatProduct(product)
  }

  /**
   * Lists all products of a seller
   * @param {string} sellerId - Seller Id
   * @returns {Promise<Object[]>} - List of products of a given seller
   */
  async list (sellerId) {
    const products = await this.productsModel.list({
      sellerId
    })

    return products.map(Product.formatProduct)
  }

  /**
   *
   * @param {string} productId - Product Id
   * @param {string} sellerId - Seller Id
   * @param {Object} updates - Updates
   * @param {string} updates.name - New product name
   * @param {number} updates.stock - New stock number
   * @returns {Promise<void>} - Updated the product
   */
  async update (productId, sellerId, updates) {
    const updatedProduct = await this.productsModel.update(productId, sellerId, updates)

    if (updatedProduct === null) {
      throw new NotFoundError('product')
    }
  }

  /**
   * Deleted a product
   * @param {string} productId  - Product Id
   * @param {string} sellerId - Seller Id
   * @returns {Promise<void>} - Deleted product
   */
  async delete (productId, sellerId) {
    const deletedProduct = await this.productsModel.delete(productId, sellerId)

    if (deletedProduct === null) {
      throw new NotFoundError('product')
    }
  }
}

module.exports = Product
