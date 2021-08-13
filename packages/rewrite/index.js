const visit = require('unist-util-visit')
const anymatch = require('anymatch')
const path = require('path')
module.exports = ({markdownAST, markdownNode, getNode}, pluginOptions) => {
  /** @type {PluginOptions} */
  const defaults = {
    pattern: /^(.*)$/,
    replace: '$1',
    extensions: ['.md', '.mdx', '.markdown'],
    fileIgnore: [],
    fileParentIgnore: [],
    pathIgnore: [],
  }
  const {fileIgnore, extensions, fileParentIgnore, pathIgnore} = Object.assign(
    defaults,
    pluginOptions,
  )
  // console.log('markdownNode', markdownNode)
  const parentNode = getNode(markdownNode.parent)
  const relativePath = parentNode.relativePath
  const isIgnore = anymatch(fileIgnore, relativePath)
  let slug = ''
  if (markdownNode && markdownNode.fields && markdownNode.fields.slug) {
    slug = markdownNode.fields.slug
  }

  let shouldRewrite = !isIgnore && slug
  if (!shouldRewrite) {
    return markdownNode
  }

  const shouldRewriteToParent = !anymatch(fileParentIgnore, relativePath)

  /** @type {{(node: {url: string}) => void}} */
  const visitor = node => {
    // console.log('node.url', node.url)

    node.url = transformUrl(node.url, {
      fileUrl: slug,
      extensions,
      shouldRewriteToParent,
      pathIgnore,
    })
    // console.log('node final', node.url)
  }
  visit(markdownAST, 'link', visitor)
  visit(markdownAST, 'definition', node => {
    // console.log('node.url', node.url)

    node.url = transformUrl(node.url, {
      fileUrl: slug,
      extensions,
      shouldRewriteToParent,
      pathIgnore,
    })
    // console.log('node final', node.url)
  })
  return markdownAST
}

function transformUrl(url, options) {
  const {extensions, shouldRewriteToParent, fileUrl} = options

  const isExternalLink = url.slice(0, 12).includes('//')
  let shouldReplace = !isExternalLink

  if (shouldReplace && Array.isArray(extensions)) {
    const extname = path.extname(url || '')

    const matchedExtname = extensions.find(n => extname === n)

    if (matchedExtname) {
      if (shouldRewriteToParent) {
        url = path.join(fileUrl, '../', url)
        url = url.slice(0, url.length - matchedExtname.length)
      } else {
        url = path.join(fileUrl, url)
        url = url.slice(0, url.length - matchedExtname.length)
      }
    } else {
      if (shouldRewriteToParent) {
        url = path.join(fileUrl, '../', url)
      } else {
        url = path.join(fileUrl, url)
      }
    }
    if (!url.endsWith('/')) {
      url = url + '/'
    }
  }

  return url
}
