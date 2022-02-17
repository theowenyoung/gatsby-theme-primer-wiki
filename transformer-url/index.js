const isRelativeUrl = require("is-relative-url");
const path = require("path");
function transformUrl(url, options) {
  const {
    extensions = [],
    addParent,
    fileUrl,
    removeExtension = true,
  } = options;
  let shouldReplace = url && isRelativeUrl(url) && !url.startsWith("/");

  if (shouldReplace && Array.isArray(extensions)) {
    const extname = path.extname(url || "");

    const matchedExtname = extensions.find((n) => extname === n);

    if (removeExtension && matchedExtname) {
      if (addParent) {
        url = path.posix.join(fileUrl, "../", url);
        url = url.slice(0, url.length - matchedExtname.length);
      } else {
        url = path.posix.join(fileUrl, url);
        url = url.slice(0, url.length - matchedExtname.length);
      }
    } else {
      if (addParent) {
        url = path.posix.join(fileUrl, "../", url);
      } else {
        url = path.posix.join(fileUrl, url);
      }
    }
    if (removeExtension && !url.endsWith("/")) {
      url = url + "/";
    }
  }

  return url;
}
module.exports = transformUrl;
