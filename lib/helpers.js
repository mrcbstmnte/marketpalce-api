'use strict'

const errors = require('restify-errors')

const {
  NotFoundError,
  BusinessLogicError
} = require('@lib/errors')

/**
 * Resolves errors into API related error
 * @param {Object} error - Error to be resolved
 * @returns {Object} - API error
 */
exports.resolveApiError = function (error) {
  if (error instanceof NotFoundError) {
    return new errors.NotFoundError(error.message)
  }

  if (error instanceof BusinessLogicError) {
    return new errors.ConflictError(error.message)
  }

  return new errors.InternalServerError()
}
