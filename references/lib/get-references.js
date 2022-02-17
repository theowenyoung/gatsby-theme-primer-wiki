const remark = require("remark");
var visit = require("unist-util-visit");

const isRelativeUrl = require("is-relative-url");
const anymatch = require("anymatch");

const transformerMarkdownUrl = require("@theowenyoung/transformer-markdown-url");
const remarkRewrite = require("@theowenyoung/remark-rewrite");
const inlineLinks = require("remark-inline-links");
const getReferences = async (string, options) => {
  let result = {
    pages: [],
  };
  const markdownNode = options.node;
  // console.log("markdownNode", markdownNode);
  const parentNode = options.getNode(markdownNode.parent);
  const relativePath = parentNode.relativePath;
  const isIgnore = anymatch(options.fileIgnore, relativePath);
  let shouldRewrite = !isIgnore;
  if (!shouldRewrite) {
    return result;
  }

  const shouldRewriteToParent = !anymatch(
    options.fileParentIgnore,
    relativePath
  );
  let references = [];
  function getAllOutbounds() {
    return transformer;

    function transformer(tree) {
      visit(tree, onvisit);

      function onvisit(node, index, parent) {
        if (node.type === "link") {
          console.log("node", node.url);

          if (isRelativeUrl(node.url)) {
            references.push({
              url: transformerMarkdownUrl(node.url, {
                extensions: options.extensions,
                addParent: shouldRewriteToParent,
                fileUrl: markdownNode.fields.slug,
              }),
            });
          }
        }
        return node;
      }
    }
  }

  return remark()
    .use(inlineLinks)
    .use(remarkRewrite, options)
    .use(getAllOutbounds)
    .process(string)
    .then((file) => {
      result.pages = references;
      console.log("references", references);

      return result;
    });
};

exports.getReferences = getReferences;

function getOutboundReferencesSlugs(outboundReferences) {
  const mapped = outboundReferences.pages.map((x) => x.url);
  return mapped;
}
exports.getOutboundReferencesSlugs = getOutboundReferencesSlugs;
