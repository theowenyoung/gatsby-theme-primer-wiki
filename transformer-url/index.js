const isRelativeUrl = require('is-relative-url')
const path = require('path')
function transformUrl(url, options) {
  const {extensions, addParent, fileUrl} = options
  let shouldReplace = isRelativeUrl(url)

  if (shouldReplace && Array.isArray(extensions)) {
    const extname = path.extname(url || '')

    const matchedExtname = extensions.find(n => extname === n)

    if (matchedExtname) {
      if (addParent) {
        url = path.join(fileUrl, '../', url)
        url = url.slice(0, url.length - matchedExtname.length)
      } else {
        url = path.join(fileUrl, url)
        url = url.slice(0, url.length - matchedExtname.length)
      }
    } else {
      if (addParent) {
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
module.exports = transformUrl
