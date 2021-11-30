'use strict'

const helpers = require('@lib/helpers')

class UserCreateRoute {
  /**
   * @param {Object} router - Express router
   * @param {Object} context - Service context
   * @param {Object} context.userController - User controller
   */
  constructor (router, context) {
    this.router = router
    this.controller = context.userController
  }

  /**
   * Sets up route
   */
  setupRoutes () {
    this.router.post(
      '/user',
      this.createUser.bind(this)
    )
  }

  /**
   * Creates a user
   */
  async createUser (req, res, next) {
    const {
      name,
      email,
      password,
      role
    } = req.body

    try {
      await this.controller.create({
        name,
        email,
        password,
        role
      })

      res.json({
        ok: true
      })
    } catch (error) {
      return next(helpers.resolveApiError(error))
    }
  }
}

module.exports = UserCreateRoute
