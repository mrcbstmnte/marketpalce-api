'use strict'

exports.Products = {
  type: 'object',
  properties: {
    _id: {
      type: 'objectId',
      description: 'Product Id'
    },
    sellerId: {
      type: 'objectId',
      description: 'Seller Id'
    },
    name: {
      type: 'string',
      description: 'Product name'
    },
    stock: {
      type: 'integer',
      description: 'Number of stocks remaining'
    },
    deleted: {
      type: 'boolean',
      description: 'Flag to indicate whether the product is deleted'
    },
    createdAt: {
      type: 'date',
      description: 'Time when the product was created'
    },
    updatedAt: {
      type: 'date',
      description: 'Time when the product was last updated'
    },
    deletedAt: {
      type: 'date',
      description: 'Time when the product was deleted'
    }
  },
  required: [
    '_id',
    'sellerId',
    'name',
    'stock',
    'deleted',
    'createdAt',
    'updatedAt'
  ]
}
