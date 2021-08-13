'use strict'

const {getReferences} = require('./get-references')

var _options2 = require('./options')

var _cache = require('./cache')

const onCreateNode = async (
  {cache, node, loadNodeContent, getNode},
  _options,
) => {
  const options = _options2.resolveOptions(_options) // if we shouldn't process this node, then return

  if (!options.types.includes(node.internal.type)) {
    return
  }

  if (node.fields && node.fields.slug) {
    const content = await loadNodeContent(node)
    const outboundReferences = await getReferences(content, {
      ...options,
      node,
      getNode,
    })

    await _cache.clearInboundReferences(cache)
    await _cache.setCachedNode(cache, node.id, {
      slug: node.fields.slug,
      outboundReferences,
    })
  } else {
    return
  }
}

exports.onCreateNode = onCreateNode
