'use strict'

const helpers = require('@lib/helpers')

class CartGetRoute {
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
    this.router.get(
      '/cart',
      this.getCart.bind(this)
    )
  }

  /**
   * Retrieves a cart
   */
  async getCart (req, res, next) {
    const {
      userId
    } = req.query

    try {
      const cart = await this.controller.get(userId)

      res.json({
        ok: true,
        cart
      })
    } catch (error) {
      return next(helpers.resolveApiError(error))
    }
  }
}

module.exports = CartGetRoute
