var visit = require("unist-util-visit");

module.exports = inlineLinks;

function inlineLinks() {
  return transformer;

  function transformer(tree) {
    visit(tree, onvisit);

    function onvisit(node, index, parent) {
      if (node.type === "link") {
        if (node.title) {
          node.children = [
            {
              type: "text",
              value: node.title,
            },
          ];
        }
      }
      return node;
    }
  }
}
