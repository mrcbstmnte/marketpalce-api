'use strict'

const helpers = require('@lib/helpers')

class CartProductRemoveRoute {
  /**
   * @param {Object} router - Express router
   * @param {Object} context - Service context
   * @param {Object} context.cartController - Cart controller
   */
  constructor (router, context) {
    this.router = router
    this.controller = context.cartController
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
      productIds
    } = req.body

    try {
      await this.controller.removeProduct(userId, productIds)

      res.json({
        ok: true
      })
    } catch (error) {
      return next(helpers.resolveApiError(error))
    }
  }
}

module.exports = CartProductRemoveRoute
