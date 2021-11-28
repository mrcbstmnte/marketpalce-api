'use strict'

/**
 * Users Model
 */
class Users {
  /**
   * @param {MongoClient} client - MongoDB client
   * @param {Object} options - Options
   * @param {string} options.databaseName - Database name
   */
  constructor (client, options) {
    this.client = client
    this.databaseName = options.databaseName
    this.db = client.db(options.database)
    this.collection = this.db.collection(Users.collectionName)
  }

  /**
   * Collection name
  */
  static get collectionName () {
    return 'users'
  }

  /**
   * Setups up collection
   * @returns {Promise<void>} - Set up collection
   */
  async setupCollection () {
    await this.collection.createIndex({
      email: 1
    }, {
      unique: true
    })
  }

  /**
   * Creates a user
   * @param {Object} user - User
   * @param {string} user.email - Email address
   * @param {string} user.password - User password
   * @param {string} user.role - User role
   * @param {string} user.name - Name of the user
   * @returns {Promise<Object>} - Created user
   */
  async create (user) {
    const now = new Date()

    try {
      const result = await this.collection.insertOne({
        email: user.email,
        password: user.password,
        name: user.name,
        role: user.role,
        deleted: false,
        createdAt: now,
        updatedAt: now
      })

      return result.ops[0]
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('duplicate_email')
      }

      throw error
    }
  }
}

module.exports = Users
