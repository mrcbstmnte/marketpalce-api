'use strict'

const helpers = require('@lib/helpers')

class ProductListRoute {
  /**
   * @param {Object} router - Express router
   * @param {Object} context - Service context
   * @param {Object} context.productController - Product controller
   */
  constructor (router, context) {
    this.router = router
    this.controller = context.productController
  }

  /**
   * Sets up route
   */
  setupRoutes () {
    this.router.get(
      '/products',
      this.listProduct.bind(this)
    )
  }

  /**
   * Retrieves products
   */
  async listProduct (req, res, next) {
    const {
      sellerId
    } = req.query

    try {
      const products = await this.controller.list(sellerId)

      res.json({
        ok: true,
        products
      })
    } catch (error) {
      return next(helpers.resolveApiError(error))
    }
  }
}

module.exports = ProductListRoute
