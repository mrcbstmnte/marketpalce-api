'use strict'

const {
  NotFoundError,
  BusinessLogicError
} = require('@lib/errors')
const errors = require('@lib/api-errors')

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
