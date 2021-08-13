'use strict'

exports.generateData = generateData

var _path = require('path')

var _nonNullable = require('./non-nullable')

var _cache = require('./cache')

function hasChildInArrayExcept(node, array, except, getNode) {
  return node.children.some(id => {
    if (id === except) {
      return false
    }

    if (array.some(x => x.id === id)) {
      return true
    }

    const child = getNode(id)

    if (!child || !child.children || !child.children.length) {
      return false
    }

    return hasChildInArrayExcept(child, array, except, getNode)
  })
}

let currentGeneration

async function generateData(cache, getNode) {
  if (currentGeneration) {
    return currentGeneration
  }

  currentGeneration = Promise.resolve().then(async () => {
    const nodes = await _cache.getAllCachedNodes(cache, getNode)

    const inboundReferences = {}

    function getRef(item) {
      return nodes.find(x => {
        return x.slug === item.url
      })
    }

    await Promise.all(
      nodes
        .map(node => {
          const mapped = node.outboundReferences.pages
            .map(getRef)
            .filter(_nonNullable.nonNullable)
            .map(x => x.node.id)
          mapped.forEach(x => {
            if (!inboundReferences[x]) {
              inboundReferences[x] = []
            }

            inboundReferences[x].push(node.node)
          })
          return {...node, resolvedOutboundReferences: mapped}
        })
        .map(data => _cache.setCachedNode(cache, data.node.id, data)),
    )
    Object.keys(inboundReferences).forEach(nodeId => {
      inboundReferences[nodeId] = inboundReferences[nodeId].filter(
        node =>
          getNode(node.parent) &&
          !hasChildInArrayExcept(
            getNode(node.parent),
            inboundReferences[nodeId],
            node.id, // @ts-ignore
            getNode,
          ),
      )
    })
    const inboundReferencesId = Object.keys(inboundReferences).reduce(
      (prev, x) => {
        prev[x] = inboundReferences[x].map(y => y.id)
        return prev
      },
      {},
    )
    await _cache.setInboundReferences(cache, inboundReferencesId)
    currentGeneration = undefined
    return true
  })
  return currentGeneration
}
