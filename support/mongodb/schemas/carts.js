'use strict'

exports.Carts = {
  type: 'object',
  properties: {
    _id: {
      type: 'objectId',
      description: 'Id of the user that owns the cart'
    },
    products: {
      type: 'array',
      description: 'Products added to the cart',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'objectId',
            description: 'Product Id'
          },
          sellerId: {
            type: 'objectId',
            description: 'Seller Id'
          },
          quantity: {
            type: 'number',
            description: 'Number of products to be ordered'
          },
          addedAt: {
            type: 'date',
            description: 'Date when the product was added'
          }
        },
        required: [
          'id',
          'quantity',
          'addedAt'
        ]
      }
    },
    createdAt: {
      type: 'date',
      description: 'Time when the cart was created'
    },
    updatedAt: {
      type: 'date',
      description: 'Time when the cart was last updated'
    }
  },
  required: [
    '_id',
    'products',
    'createdAt',
    'updatedAt'
  ]
}
