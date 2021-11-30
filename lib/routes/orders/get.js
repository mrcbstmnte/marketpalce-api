'use strict'

const helpers = require('@lib/helpers')

class OrderGetRoute {
  /**
   * @param {Object} router - Express router
   * @param {Object} context - Service context
   * @param {Object} context.orderController - Order controller
   */
  constructor (router, context) {
    this.router = router
    this.controller = context.orderController
  }

  /**
   * Sets up route
   */
  setupRoutes () {
    this.router.get(
      '/order',
      this.getOrder.bind(this)
    )
  }

  /**
   * Retrieves an order
   */
  async getOrder (req, res, next) {
    const {
      orderId,
      userId
    } = req.query

    try {
      const order = await this.controller.get(orderId, userId)

      res.json({
        ok: true,
        order
      })
    } catch (error) {
      return next(helpers.resolveApiError(error))
    }
  }
}

module.exports = OrderGetRoute
