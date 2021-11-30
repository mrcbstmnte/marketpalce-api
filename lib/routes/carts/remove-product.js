'use strict'

const helpers = require('@lib/helpers')

class CartProductRemoveRoute {
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
      '/cart/remove-product',
      this.removeProduct.bind(this)
    )
  }

  /**
   * Removes product to cart
   */
  async removeProduct (req, res, next) {
    const {
      userId,
      productId
    } = req.body

    try {
      await this.controller.removeProduct(userId, [
        productId
      ])

      res.json({
        ok: true
      })
    } catch (error) {
      return next(helpers.resolveApiError(error))
    }
  }
}

module.exports = CartProductRemoveRoute
