'use strict'

const path = require('path')

const {
  MongoClient
} = require('mongodb')

const express = require('express')
const bodyParser = require('body-parser')

const CartsModel = require('@models/carts')
const OrdersModel = require('@models/orders')
const ProductsModel = require('@models/products')
const SellersModel = require('@models/sellers')
const UsersModel = require('@models/users')

const CartController = require('@lib/controllers/cart')
const OrderController = require('@lib/controllers/order')
const ProductController = require('@lib/controllers/product')
const SellerController = require('@lib/controllers/seller')
const UserController = require('@lib/controllers/user')

const router = require('@lib/router')

class Service {
  /**
   * @param {Object} config - App configuration
   */
  constructor (config) {
    this.models = {}
    this.controllers = {}

    this.config = config
  }

  /**
   * Starts the service
   */
  async start () {
    await this.setupDependencies()
    this.setupServer()
  }

  /**
   * Sets up dependencies
   */
  async setupDependencies () {
    const {
      mongodb
    } = this.config

    this.app = express()

    this.router = express.Router()

    const mongoClient = new MongoClient(`${mongodb.connectUri}/${mongodb.databaseName}`, {
      useUnifiedTopology: true,
      writeConcern: 'majority',
      ignoreUndefined: true
    })

    await mongoClient.connect()

    const modelOptions = {
      databaseName: mongodb.databaseName
    }

    // models
    this.models.cartsModel = new CartsModel(mongoClient, modelOptions)
    this.models.ordersModel = new OrdersModel(mongoClient, modelOptions)
    this.models.productsModel = new ProductsModel(mongoClient, modelOptions)
    this.models.sellersModel = new SellersModel(mongoClient, modelOptions)
    this.models.usersModel = new UsersModel(mongoClient, modelOptions)

    // controllers
    this.controllers.cartController = new CartController({
      cartsModel: this.models.cartsModel,
      productsModel: this.models.productsModel
    })
    this.controllers.orderController = new OrderController({
      ordersModel: this.models.ordersModel,
      cartsModel: this.models.cartsModel
    })
    this.controllers.productController = new ProductController({
      productsModel: this.models.productsModel,
      sellersModel: this.models.sellersModel
    })
    this.controllers.sellerController = new SellerController({
      sellersModel: this.models.sellersModel
    })
    this.controllers.userController = new UserController({
      usersModel: this.models.usersModel,
      cartsModel: this.models.cartsModel
    })
  }

  setupServer () {
    this.setupRoutes()
    this.startListening()
  }

  /**
   * Get route path depending on environment
   */
  getRoutePath () {
    return path.resolve(__dirname, '../', 'lib/routes')
  }

  /**
   * Sets up routes
   */
  setupRoutes () {
    router.setup(this.getRoutePath(), this.router, this)

    this.app.use(bodyParser.json())
    this.app.use(this.router)
  }

  startListening () {
    const port = this.config.service.port

    this.app.listen(port)

    console.log(`Server listening on port ${port}`)
  }
}

module.exports = Service
