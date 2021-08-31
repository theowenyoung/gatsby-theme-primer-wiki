const visit = require("unist-util-visit");
const anymatch = require("anymatch");
const transformerUrl = require("@theowenyoung/transformer-markdown-url");
module.exports = ({ markdownAST, markdownNode, getNode }, pluginOptions) => {
  const defaults = {
    extensions: [".md", ".mdx", ".markdown"],
    fileIgnore: [],
    rewriteToParentUrlFileIgnore: [],
    pathIgnore: [],
  };
  const { fileIgnore, extensions, rewriteToParentUrlFileIgnore, pathIgnore } =
    Object.assign(defaults, pluginOptions);
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

  const shouldRewriteToParent = !anymatch(
    rewriteToParentUrlFileIgnore,
    relativePath
  );

  const visitor = (node, index, parent) => {
    const newUrl = transformerUrl(node.url, {
      fileUrl: slug,
      extensions,
      addParent: shouldRewriteToParent,
      pathIgnore,
    });
    const isReplaced = newUrl !== node.url;

    node.url = newUrl;

    if (isReplaced) {
      const siblings = parent.children;
      if (!siblings || !Array.isArray(siblings)) {
        return;
      }
      const previous = siblings[index - 1];
      const next = siblings[index + 1];

      if (!(previous && next)) {
        return;
      }

      const previousValue = previous.value;
      const nextValue = next.value;

      if (
        previous.type !== "text" ||
        previous.value[previousValue.length - 1] !== "[" ||
        next.type !== "text" ||
        next.value[0] !== "]"
      ) {
        return;
      }

      previous.value = previousValue.replace(/\[$/, "");
      next.value = nextValue.replace(/^\]/, "");
    }

    // console.log('node final', node.url)
  };
  visit(markdownAST, "link", visitor);
  visit(markdownAST, "definition", (node) => {
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
