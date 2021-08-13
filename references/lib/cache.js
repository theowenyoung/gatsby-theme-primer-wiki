'use strict'

exports.clearInboundReferences = exports.getInboundReferences = exports.setInboundReferences = exports.getCachedNode = exports.setCachedNode = exports.getAllCachedNodes = exports.cacheDirectory = void 0

var fs = require('fs')

var path = require('path')

var _nonNullable = require('./non-nullable')

const cacheDirectory = cache => {
  return cache.directory
}

exports.cacheDirectory = cacheDirectory
const inboundFile = `___inboundReferences.json`

const getAllCachedNodes = async (cache, getNode) => {
  const dir = cacheDirectory(cache)
  const files = await fs.promises.readdir(dir)
  return (
    await Promise.all(
      files.map(f => {
        if (f === inboundFile) {
          return
        }

        const id = decodeURIComponent(f.replace(/\.json$/, ''))
        return getCachedNode(cache, id, getNode)
      }),
    )
  ).filter(_nonNullable.nonNullable)
}

exports.getAllCachedNodes = getAllCachedNodes

const setCachedNode = (cache, id, data) => {
  return fs.promises.writeFile(
    path.join(cacheDirectory(cache), `${encodeURIComponent(id)}.json`),
    JSON.stringify({
      slug: data.slug,
      outboundReferences: data.outboundReferences,
      resolvedOutboundReferences: data.resolvedOutboundReferences,
    }),
  )
}

exports.setCachedNode = setCachedNode

const getCachedNode = async (cache, id, getNode) => {
  const node = getNode(id)

  if (!node) {
    try {
      // clean up the cache if we have some file that aren't node
      await fs.promises.unlink(
        path.join(cacheDirectory(cache), `${encodeURIComponent(id)}.json`),
      )
    } catch (err) {}

    return undefined
  }

  try {
    const data = JSON.parse(
      await fs.promises.readFile(
        path.join(cacheDirectory(cache), `${encodeURIComponent(id)}.json`),
        'utf8',
      ),
    )
    return {
      node,
      ...data,
    }
  } catch (err) {
    return undefined
  }
}

exports.getCachedNode = getCachedNode

const setInboundReferences = (cache, data) => {
  return fs.promises.writeFile(
    path.join(cacheDirectory(cache), inboundFile),
    JSON.stringify(data),
  )
}

exports.setInboundReferences = setInboundReferences

const getInboundReferences = async cache => {
  try {
    return JSON.parse(
      await fs.promises.readFile(
        path.join(cacheDirectory(cache), inboundFile),
        'utf8',
      ),
    )
  } catch (err) {
    return undefined
  }
}

exports.getInboundReferences = getInboundReferences

const clearInboundReferences = async cache => {
  try {
    await fs.promises.unlink(path.join(cacheDirectory(cache), inboundFile))
  } catch (e) {}
}

exports.clearInboundReferences = clearInboundReferences
