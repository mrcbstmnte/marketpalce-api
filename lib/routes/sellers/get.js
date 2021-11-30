'use strict'

const helpers = require('@lib/helpers')

class SellerGetRoute {
  /**
   * @param {Object} router - Express router
   * @param {Object} context - Service context
   * @param {Object} context.sellerController - Seller controller
   */
  constructor (router, context) {
    this.router = router
    this.controller = context.sellerController
  }

  /**
   * Sets up route
   */
  setupRoutes () {
    this.router.get(
      '/seller',
      this.getSeller.bind(this)
    )
  }

  /**
   * Retrieves a seller
   */
  async getSeller (req, res, next) {
    const {
      id
    } = req.query

    try {
      const seller = await this.controller.get(id)

      res.json({
        ok: true,
        seller
      })
    } catch (error) {
      return next(helpers.resolveApiError(error))
    }
  }
}

module.exports = SellerGetRoute
