'use strict'

exports.nonNullable = nonNullable

function nonNullable(value) {
  return value !== null && value !== undefined
}
