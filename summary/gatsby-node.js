const isRelativeUrl = require("is-relative-url");
const path = require("path");
const defaultOptions = require(`./default-options`);
const parseSummary = require("./parse");

/**
 * ============================================================================
 * Verify plugin loads
 * ============================================================================
 */

// should see message in console when running `gatsby develop` in example-site
// exports.onPreInit = () => console.log("Loaded gatsby-source-summary");

/**
 * ============================================================================
 * Link nodes together with a customized GraphQL Schema
 * ============================================================================
 */

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(`
  type SummaryItem {
    title: String
    url: String
    ref: String
    external: Boolean
    items: [SummaryItem]
  }

  type SummaryGroup implements Node @infer {
    title: String
    items: [SummaryItem]
  }`);
};
function unstable_shouldOnCreateNode({ node }, pluginOptions) {
  const options = defaultOptions(pluginOptions);

  return _unstable_shouldOnCreateNode({ node }, options);
}

// eslint-disable-next-line camelcase
function _unstable_shouldOnCreateNode({ node }, options) {
  // options check to stop transformation of the node
  if (options.shouldBlockNodeFromTransformation(node)) {
    return false;
  }
  if (node.internal.type === `File` && options.extensions.includes(node.ext)) {
    if (options.sourceInstanceName) {
      if (!node.sourceInstanceName === options.sourceInstanceName) {
        return false;
      }
    }
    if (options.summaryPath) {
      if (node.relativePath === options.summaryPath) {
        return true;
      } else {
        return false;
      }
    } else {
      if (
        node.relativeDirectory === "" &&
        node.name.toLowerCase() === "summary"
      ) {
        return true;
      } else {
        return false;
      }
    }
  } else {
    return false;
  }
}

/**
 * ============================================================================
 * Transform remote file nodes
 * ============================================================================
 */

exports.onCreateNode = async (
  { actions, createContentDigest, loadNodeContent, createNodeId, node },
  pluginOptions
) => {
  if (!unstable_shouldOnCreateNode({ node }, pluginOptions)) {
    return;
  }
  const helpers = Object.assign({}, actions, {
    createContentDigest,
    createNodeId,
  });
  const content = await loadNodeContent(node);
  let parsedContent;
  try {
    parsedContent = await parseSummary(content);
  } catch {
    const hint = node.absolutePath
      ? `file ${node.absolutePath}`
      : `in node ${node.id}`;
    throw new Error(`Unable to parse Summary: ${hint}`);
  }

  if (Array.isArray(parsedContent.groups)) {
    parsedContent.groups.forEach((obj, i) => {
      // transform ref to url
      if (Array.isArray(obj.items)) {
        obj.items = obj.items.map(formatItem);
      }
      createNodeFromData(
        obj,
        obj.id
          ? String(obj.id)
          : createNodeId(`${node.id} [${i}] >>> SummaryGroup`),
        "SummaryGroup",
        helpers,
        node
      );
    });
  }
};
function formatItem(item, pluginOptions) {
  const options = defaultOptions(pluginOptions);
  const ref = item.ref;
  let url = "";
  let external = false;
  if (ref) {
    const ext = path.extname(ref);
    const basename = path.basename(ref);
    const name = basename.toLowerCase().slice(0, basename.length - ext.length);

    if (isRelativeUrl(ref) && options.extensions.includes(ext)) {
      // transformer to slug
      const sliceLength =
        name === "readme" || name === "index"
          ? name.length + ext.length
          : ext.length;

      url = ref.slice(0, ref.length - sliceLength);
      if (!url.startsWith("/")) {
        url = "/" + url;
      }
      if (!url.endsWith("/")) {
        url = url + "/";
      }
    } else {
      url = ref;
    }
    if (!isRelativeUrl(ref)) {
      external = true;
    }
  }
  return {
    title: item.title,
    ref: item.ref,
    url: url,
    external,
    items: item.items
      ? item.items.map((item) => {
          return formatItem(item);
        })
      : [],
  };
}
exports.unstable_shouldOnCreateNode = unstable_shouldOnCreateNode;
// helper function for creating nodes
const createNodeFromData = (item, id, nodeType, helpers, parent = null) => {
  const nodeMetadata = {
    id: id,
    parent: parent ? parent.id : null, // this is used if nodes are derived from other nodes, a little different than a foreign key relationship, more fitting for a transformer plugin that is changing the node
    children: [],
    internal: {
      type: nodeType,
      content: JSON.stringify(item),
      contentDigest: helpers.createContentDigest(item),
    },
  };

  const node = Object.assign({}, item, nodeMetadata);
  helpers.createNode(node);
  if (parent) {
    helpers.createParentChildLink({ parent: parent, child: node });
  }
  return node;
};
