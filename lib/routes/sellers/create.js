'use strict'

const helpers = require('@lib/helpers')

class SellerCreateRoute {
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
    this.router.post(
      '/seller',
      this.createSeller.bind(this)
    )
  }

  /**
   * Creates a seller
   */
  async createSeller (req, res, next) {
    const {
      name
    } = req.body

    try {
      await this.controller.create({
        name
      })

      res.json({
        ok: true
      })
    } catch (error) {
      return next(helpers.resolveApiError(error))
    }
  }
}

module.exports = SellerCreateRoute
