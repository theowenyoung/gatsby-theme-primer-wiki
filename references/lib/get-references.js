"use strict";
const remark = require("remark");
const remarkInlineLinks = require("remark-inline-links");
const isRelativeUrl = require("is-relative-url");
const anymatch = require("anymatch");

var visit = require("unist-util-visit");
const transformerMarkdownUrl = require("@theowenyoung/transformer-markdown-url");
const getReferences = async (string, options) => {
  let result = {
    pages: []
  };
  const markdownNode = options.node;
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
          if (isRelativeUrl(node.url)) {
            references.push({
              url: transformerMarkdownUrl(node.url, {
                extensions: options.extensions,
                addParent: shouldRewriteToParent,
                fileUrl: markdownNode.fields.slug
              })
            });
          }
        }
        return node;
      }
    }
  }
  return remark()
    .use(remarkInlineLinks)
    .use(getAllOutbounds)
    .process(string)
    .then(file => {
      result.pages = references;
      return result;
    });
};

exports.getReferences = getReferences;

function getOutboundReferencesSlugs(outboundReferences) {
  const mapped = outboundReferences.pages.map(x => x.url);
  return mapped;
}
exports.getOutboundReferencesSlugs = getOutboundReferencesSlugs;
