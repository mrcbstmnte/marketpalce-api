'use strict'

exports.Sellers = {
  type: 'object',
  properties: {
    _id: {
      type: 'objectId',
      description: 'Seller Id'
    },
    name: {
      type: 'string',
      description: 'Seller name'
    },
    deleted: {
      type: 'boolean',
      description: 'Flag to indicate if the seller is deleted'
    },
    createdAt: {
      type: 'date',
      description: 'Time when the seller was created'
    },
    updatedAt: {
      type: 'date',
      description: 'Time when the seller was last updated'
    },
    deletedAt: {
      type: 'date',
      description: 'Time when the seller was deleted'
    }
  },
  required: [
    '_id',
    'name',
    'deleted',
    'createdAt',
    'updatedAt'
  ]
}
