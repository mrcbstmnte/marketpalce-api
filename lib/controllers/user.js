'use strict'

/**
 * User controller
 */
class User {
  /**
   * @param {Object} dependencies - Dependencies
   * @param {Object} dependencies.usersModel - Users Model
   * @param {Object} dependencies.cartsModel - Carts Model
   */
  constructor (dependencies = {}) {
    const {
      usersModel,
      cartsModel
    } = dependencies

    if (usersModel === undefined) {
      throw new Error('usersModel should be provided')
    }

    if (cartsModel === undefined) {
      throw new Error('cartsModel should be provided')
    }

    this.usersModel = usersModel
    this.cartsModel = cartsModel
  }

  /**
   * Creates a user
   * @param {Object} user - User
   * @param {string} user.name - Name of the user
   * @param {string} user.email - User email address
   * @param {string} user.password - User password
   * @param {string} user.role - User role
   * @returns {Promise<void>} - User created
   */
  async create (user) {
    const createdUser = await this.usersModel.create({
      email: user.email,
      password: user.password,
      role: user.role,
      name: user.name
    })

    await this.cartsModel.create(createdUser._id.toString())
  }
}

module.exports = User
