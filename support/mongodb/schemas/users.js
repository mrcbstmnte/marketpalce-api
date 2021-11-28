'use strict'

exports.Users = {
  type: 'object',
  properties: {
    _id: {
      type: 'objectId',
      description: 'User Id'
    },
    email: {
      type: 'string',
      description: 'Email address'
    },
    password: {
      type: 'string',
      description: 'Password'
    },
    name: {
      type: 'string',
      description: 'Name of the user'
    },
    createdAt: {
      type: 'date',
      description: 'Time when the user was created'
    },
    updatedAt: {
      type: 'date',
      description: 'Time when the user was last updated'
    },
    deletedAt: {
      type: 'date',
      description: 'Time when the user was deleted'
    }
  },
  required: [
    '_id',
    'email',
    'password',
    'name',
    'role',
    'createdAt',
    'updatedAt'
  ]
}
