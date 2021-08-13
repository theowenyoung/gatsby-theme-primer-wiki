'use strict'

exports.setFieldsOnGraphQLNodeType = exports.createSchemaCustomization = void 0

var _options2 = require('./options')

var _computeInbounds = require('./compute-inbounds')

var _cache = require('./cache')

var _nonNullable = require('./non-nullable')

const createSchemaCustomization = ({actions}, _options) => {
  const options = _options2.resolveOptions(_options)
  actions.createTypes(`
    union ReferenceTarget = ${options.types.join(' | ')}
  `)
}

exports.createSchemaCustomization = createSchemaCustomization

const setFieldsOnGraphQLNodeType = ({cache, type, getNode}, _options) => {
  const options = _options2.resolveOptions(_options) // if we shouldn't process this node, then return

  if (!options.types.includes(type.name)) {
    return {}
  }

  return {
    outboundReferences: {
      type: `[ReferenceTarget!]!`,
      resolve: async node => {
        let cachedNode = await _cache.getCachedNode(cache, node.id, getNode)

        if (!cachedNode || !cachedNode.resolvedOutboundReferences) {
          await _computeInbounds.generateData(cache, getNode)
          cachedNode = await _cache.getCachedNode(cache, node.id, getNode)
        }

        if (cachedNode && cachedNode.resolvedOutboundReferences) {
          return cachedNode.resolvedOutboundReferences
            .map(nodeId => getNode(nodeId))
            .filter(_nonNullable.nonNullable)
        }

        return []
      },
    },
    inboundReferences: {
      type: `[ReferenceTarget!]!`,
      resolve: async node => {
        let data = await _cache.getInboundReferences(cache)

        if (!data) {
          await _computeInbounds.generateData(cache, getNode)
          data = await _cache.getInboundReferences(cache)
        }

        if (data) {
          return (data[node.id] || [])
            .map(nodeId => getNode(nodeId))
            .filter(_nonNullable.nonNullable)
        }

        return []
      },
    },
  }
}

exports.setFieldsOnGraphQLNodeType = setFieldsOnGraphQLNodeType
