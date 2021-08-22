const visit = require("unist-util-visit");
const anymatch = require("anymatch");
const transformerUrl = require("@theowenyoung/transformer-markdown-url");
module.exports = ({ markdownAST, markdownNode, getNode }, pluginOptions) => {
  const defaults = {
    extensions: [".md", ".mdx", ".markdown"],
    fileIgnore: [],
    fileParentIgnore: [],
    pathIgnore: [],
  };
  const { fileIgnore, extensions, fileParentIgnore, pathIgnore } =
    Object.assign(defaults, pluginOptions);
  // console.log('markdownNode', markdownNode)
  const parentNode = getNode(markdownNode.parent);
  const relativePath = parentNode.relativePath;
  const isIgnore = anymatch(fileIgnore, relativePath);
  let slug = "";
  if (markdownNode && markdownNode.fields && markdownNode.fields.slug) {
    slug = markdownNode.fields.slug;
  }

  let shouldRewrite = !isIgnore && slug;
  if (!shouldRewrite) {
    return markdownNode;
  }

  const shouldRewriteToParent = !anymatch(fileParentIgnore, relativePath);

  const visitor = (node) => {
    // console.log('node.url', node.url)

    node.url = transformerUrl(node.url, {
      fileUrl: slug,
      extensions,
      addParent: shouldRewriteToParent,
      pathIgnore,
    });
    // console.log('node final', node.url)
  };
  visit(markdownAST, "link", visitor);
  visit(markdownAST, "definition", (node) => {
    // console.log('node.url', node.url)

    node.url = transformerUrl(node.url, {
      fileUrl: slug,
      extensions,
      addParent: shouldRewriteToParent,
      pathIgnore,
    });
    // console.log('node final', node.url)
  });
  return markdownAST;
};
