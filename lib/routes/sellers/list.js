'use strict'

const helpers = require('@lib/helpers')

class SellerListRoute {
  /**
   * @param {Object} router - Express router
   * @param {Object} context - Service context
   * @param {Object} context.controllers - Service controllers
   * @param {Object} context.controllers.seller - Seller controller
   */
  constructor (router, context) {
    this.router = router
    this.controller = context.controllers.seller
  }

  /**
   * Sets up route
   */
  setupRoutes () {
    this.router.get(
      '/sellers',
      this.createSeller.bind(this)
    )
  }

  /**
   * Retrieves all sellers
   */
  async createSeller (req, res, next) {
    try {
      const sellers = await this.controller.list()

      res.json({
        ok: true,
        sellers
      })
    } catch (error) {
      return next(helpers.resolveApiError(error))
    }
  }
}

module.exports = SellerListRoute
