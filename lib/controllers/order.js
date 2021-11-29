'use strict'

const { NotFoundError, BusinessLogicError } = require('../errors')

/**
 * Order Controller
 */
class Order {
  /**
   * @param {Object} dependencies - Dependencies
   * @param {Object} dependencies.ordersModel - Orders Model
   * @param {Object} dependencies.cartsModel - Carts Model
   */
  constructor (dependencies = {}) {
    const {
      ordersModel,
      cartsModel
    } = dependencies

    if (ordersModel === undefined) {
      throw new Error('ordersModel should be provided')
    }

    if (cartsModel === undefined) {
      throw new Error('cartsModel should be provided')
    }

    this.ordersModel = ordersModel
    this.cartsModel = cartsModel
  }

  /**
   * Creates an order based on the user's cart
   * @param {string} userId - User Id
   * @returns {Promise<void>} - Order created
   */
  async create (userId) {
    const cart = await this.cartsModel.getById(userId)

    if (cart === null) {
      throw new NotFoundError('cart')
    }

    if (cart.products.length === 0) {
      throw new BusinessLogicError('empty_cart')
    }

    await this.ordersModel.create(userId, cart.products)
  }

  /**
   * Retrieves a specific order of the user
   * @param {string} orderId - Order Id
   * @param {string} userId - User Id
   * @returns {Promise<Object>} - The order of the user
   */
  async get (orderId, userId) {
    const order = await this.ordersModel.getById(orderId, userId)

    if (order === null) {
      throw new NotFoundError('order')
    }

    order.id = order._id.toString()
    order.userId = order.userId.toString()
    delete order._id

    return order
  }
}

module.exports = Order