const relativeToSlug = require("@theowenyoung/gatsby-relative-path-to-slug");
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  const fileNode = getNode(node.parent);

  if (
    (node.internal.type === "MarkdownRemark" || node.internal.type === "Mdx") &&
    fileNode.internal.type === "File"
  ) {
    let value = relativeToSlug(fileNode.relativePath);
    createNodeField({
      name: `slug`,
      node,
      value,
    });
  }
};
