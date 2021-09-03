const remarkRewrite = require("@theowenyoung/remark-rewrite");
module.exports = (
  { markdownAST, markdownNode, getNode, files, ...rest },
  pluginOptions
) => {
  const parentNode = getNode(markdownNode.parent);
  const relativePath = parentNode.relativePath;
  const options = {
    ...pluginOptions,
    files,
    relativePath: relativePath,
  };
  const rewrite = remarkRewrite(options);
  return rewrite(markdownAST);
};
