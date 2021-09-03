const path = require("path");
module.exports = function (
  relativePath,
  {
    trailingSlash = true,
    removeExtension,
    basePath,
    extensions = [".md", ".mdx", ".markdown"],
  } = {}
) {
  if (!relativePath) return "";
  if (extensions.includes(path.extname(relativePath))) {
    removeExtension = true;
  }
  let theRelativePath = slash(relativePath);

  if (basePath && !removeExtension) {
    basePath = path.dirname(basePath);
    theRelativePath = path.posix.relative(slash(basePath), slash(relativePath));
  }

  let { dir = ``, name, ext } = path.parse(theRelativePath);
  if (removeExtension === false) {
    name = name + ext;
  } else {
    if (!extensions.includes(ext)) {
      name = name + ext;
      removeExtension = false;
    } else {
      removeExtension = true;
    }
  }

  const parsedName = name === `index` ? `` : name;
  let value = path.posix.join(
    basePath && !removeExtension ? "" : `/`,
    dir,
    parsedName,
    trailingSlash && removeExtension ? `/` : ``
  );

  const lowerCaseValue = value.toLowerCase();

  if (lowerCaseValue.endsWith("/readme/")) {
    value = value.slice(0, -7);
  }
  if (lowerCaseValue.endsWith("/index/")) {
    value = value.slice(0, -6);
  }
  return value;
};
function slash(path) {
  const isExtendedLengthPath = /^\\\\\?\\/.test(path);

  if (isExtendedLengthPath) {
    return path;
  }

  return path.replace(/\\/g, `/`);
}
