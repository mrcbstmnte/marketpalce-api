'use strict'

const helpers = require('@lib/helpers')

class ProductGetRoute {
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
      '/product',
      this.getProduct.bind(this)
    )
  }

  /**
   * Retrieves a product
   */
  async getProduct (req, res, next) {
    const {
      sellerId,
      productId
    } = req.query

    try {
      const product = await this.controller.get(productId, sellerId)

      res.json({
        ok: true,
        product
      })
    } catch (error) {
      return next(helpers.resolveApiError(error))
    }
  }
}

module.exports = ProductGetRoute
