'use strict'

const helpers = require('@lib/helpers')

class CartProductAddRoute {
  /**
   * @param {Object} router - Express router
   * @param {Object} context - Service context
   * @param {Object} context.controllers - Service controllers
   * @param {Object} context.controllers.cart - Cart controller
   */
  constructor (router, context) {
    this.router = router
    this.controller = context.controllers.cart
  }

  /**
   * Sets up route
   */
  setupRoutes () {
    this.router.put(
      '/cart/add-product',
      this.addProduct.bind(this)
    )
  }

  /**
   * Adds product to cart
   */
  async addProduct (req, res, next) {
    const {
      userId,
      product
    } = req.body

    try {
      await this.controller.addProduct(userId, product)

      res.json({
        ok: true
      })
    } catch (error) {
      return next(helpers.resolveApiError(error))
    }
  }
}

module.exports = CartProductAddRoute
