'use strict'

const errors = require('restify-errors')

const {
  NotFoundError,
  BusinessLogicError
} = require('@lib/errors')

const helpers = require('@lib/helpers')

describe('Helpers', () => {
  describe('#resolveApiError', () => {
    it('should resolve not found error', () => {
      const error = new NotFoundError()
      const apiError = helpers.resolveApiError(error)

      expect(apiError).toBeInstanceOf(errors.NotFoundError)
    })

    it('should resolve business logic error', () => {
      const error = new BusinessLogicError('max_blah')
      const apiError = helpers.resolveApiError(error)

      expect(apiError).toBeInstanceOf(errors.ConflictError)
    })

    it('should resolve internal server errors', () => {
      const error = new Error()
      const apiError = helpers.resolveApiError(error)

      expect(apiError).toBeInstanceOf(errors.InternalServerError)
    })
  })
})
