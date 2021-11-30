'use strict'

const helpers = require('@lib/helpers')

class SellerUpdateRoute {
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
    this.router.put(
      '/seller',
      this.updateSeller.bind(this)
    )
  }

  /**
   * Updates a seller
   */
  async updateSeller (req, res, next) {
    const {
      id,
      name
    } = req.body

    try {
      await this.controller.update(id, {
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

module.exports = SellerUpdateRoute
