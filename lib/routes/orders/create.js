'use strict'

const helpers = require('@lib/helpers')

class OrderCreateRoute {
  /**
   * @param {Object} router - Express router
   * @param {Object} context - Service context
   * @param {Object} context.controllers - Service controllers
   * @param {Object} context.controllers.order - Order controller
   */
  constructor (router, context) {
    this.router = router
    this.controller = context.controllers.order
  }

  /**
   * Sets up route
   */
  setupRoutes () {
    this.router.post(
      '/order',
      this.createOrder.bind(this)
    )
  }

  /**
   * Creates an order
   */
  async createOrder (req, res, next) {
    const {
      userId
    } = req.body

    try {
      await this.controller.create(userId)

      res.json({
        ok: true
      })
    } catch (error) {
      return next(helpers.resolveApiError(error))
    }
  }
}

module.exports = OrderCreateRoute
