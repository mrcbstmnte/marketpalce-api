'use strict'

const helpers = require('@lib/helpers')

class UserCreateRoute {
  /**
   * @param {Object} router - Express router
   * @param {Object} context - Service context
   * @param {Object} context.controllers - Service controllers
   * @param {Object} context.controllers.user - User controller
   */
  constructor (router, context) {
    this.router = router
    this.controller = context.controllers.user
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
      const user = await this.controller.create({
        name,
        email,
        password,
        role
      })

      res.json({
        ok: true,
        user
      })
    } catch (error) {
      return next(helpers.resolveApiError(error))
    }
  }
}

module.exports = UserCreateRoute
