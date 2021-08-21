const { createFilePath } = require(`gatsby-source-filesystem`);

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  const fileNode = getNode(node.parent);

  if (
    (node.internal.type === "MarkdownRemark" || node.internal.type === "Mdx") &&
    fileNode.internal.type === "File"
  ) {
    let value = createFilePath({ node, getNode });

    const lowerCaseValue = value.toLowerCase();

    if (lowerCaseValue.endsWith("/readme/")) {
      value = value.slice(0, -7);
    }
    if (lowerCaseValue.endsWith("/index/")) {
      value = value.slice(0, -6);
    }

    createNodeField({
      name: `slug`,
      node,
      value,
    });
  }
};
