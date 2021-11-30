'use strict'

const helpers = require('@lib/helpers')

class ProductDeleteRoute {
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
    this.router.delete(
      '/product',
      this.deleteProduct.bind(this)
    )
  }

  /**
   * Deletes a product
   */
  async deleteProduct (req, res, next) {
    const {
      sellerId,
      productId
    } = req.body

    try {
      await this.controller.delete(productId, sellerId)

      res.json({
        ok: true
      })
    } catch (error) {
      return next(helpers.resolveApiError(error))
    }
  }
}

module.exports = ProductDeleteRoute
