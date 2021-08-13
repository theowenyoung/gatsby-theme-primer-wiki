'use strict'

exports.resolveOptions = void 0
const defaultOptions = {
  types: ['Mdx'],
  extensions: ['.md', '.mdx', '.markdown'],
  fileIgnore: [],
  fileParentIgnore: [],
}

const resolveOptions = options => {
  return {...defaultOptions, ...options}
}

exports.resolveOptions = resolveOptions
