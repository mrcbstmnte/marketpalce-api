'use strict'

const helpers = require('@lib/helpers')

class SellerDeleteRoute {
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
    this.router.delete(
      '/seller',
      this.deleteSeller.bind(this)
    )
  }

  /**
   * Deletes a seller
   */
  async deleteSeller (req, res, next) {
    const {
      id
    } = req.body

    try {
      await this.controller.delete(id)

      res.json({
        ok: true
      })
    } catch (error) {
      return next(helpers.resolveApiError(error))
    }
  }
}

module.exports = SellerDeleteRoute
