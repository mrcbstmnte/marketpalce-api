'use strict'

const helpers = require('@lib/helpers')

class ProductUpdateRoute {
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
    this.router.put(
      '/product',
      this.updateProduct.bind(this)
    )
  }

  /**
   * Updates a product
   */
  async updateProduct (req, res, next) {
    const {
      sellerId,
      product
    } = req.body

    try {
      await this.controller.update(product.id, sellerId, {
        name: product.name,
        stock: product.stock
      })

      res.json({
        ok: true
      })
    } catch (error) {
      return next(helpers.resolveApiError(error))
    }
  }
}

module.exports = ProductUpdateRoute
