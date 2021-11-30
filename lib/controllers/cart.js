'use strict'

const { NotFoundError, BusinessLogicError } = require('../errors')

/**
 * Cart Controller
 */
class Cart {
  /**
   * @param {Object} dependencies - Dependencies
   * @param {Object} dependencies.cartsModel - Carts Model
   * @param {Object} dependencies.productsModel - Orders Model
   */
  constructor (dependencies = {}) {
    const {
      cartsModel,
      productsModel
    } = dependencies

    if (cartsModel === undefined) {
      throw new Error('cartsModel should be provided')
    }

    if (productsModel === undefined) {
      throw new Error('productsModel should be provided')
    }

    this.cartsModel = cartsModel
    this.productsModel = productsModel
  }

  /**
   * Retrieves the given user's cart
   * @param {string} userId - User Id
   * @returns {Promise<Object>} - User's cart
   */
  async get (userId) {
    const cart = await this.cartsModel.getById(userId)

    if (cart === null) {
      throw new NotFoundError('cart')
    }

    cart.id = cart._id.toString()
    delete cart._id

    return cart
  }

  /**
   * Adds a product to the cart
   * @param {string} userId - User Id
   * @param {Object} product - Product
   * @param {string} product.id - Product Id
   * @param {string} product.sellerId - Seller Id
   * @param {number} product.quantity - Number of products
   * @returns {Promise<void>} - Added product to the cart
   */
  async addProduct (userId, product) {
    const cart = await this.get(userId)
    const prdct = await this.productsModel.getById(product.id, product.sellerId)

    if (prdct === null) {
      throw new NotFoundError('product')
    }

    if (prdct.stock < product.quantity) {
      throw new BusinessLogicError('low_on_stock')
    }

    const existingProduct = cart.products.find((prdct) => prdct.id === product.id)

    if (existingProduct !== undefined) {
      await this.cartsModel.updateQuantity(userId, {
        id: product.id,
        quantity: product.quantity + existingProduct.quantity
      })

      return
    }

    await this.cartsModel.addProducts(userId, [
      product
    ])
  }

  /**
   * Removes product from the cart
   * @param {string} userId - User Id
   * @param {string[]} productIds - Array of product Ids to be removed
   * @returns {Promise<void>} - Removed products from the cart
   */
  async removeProduct (userId, productIds) {
    const cart = await this.cartsModel.removeProducts(userId, productIds)

    if (cart === null) {
      throw new NotFoundError('product')
    }
  }
}

module.exports = Cart
