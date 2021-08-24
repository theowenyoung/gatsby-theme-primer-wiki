const path = require("path");
const { execSync } = require("child_process");
const { getTitle, defaultOptions } = require("./gatsby-util");
const urlJoin = require("url-join");

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;

  createTypes(`
    type NavItem {
      title: String
      url: String
      external: Boolean
      items: [NavItem]
    }
    type PrimerWikiThemeConfig implements Node {
      sidebarDepth: Int,
      editUrlText: String,
      shouldShowLastUpdated: Boolean,
      lastUpdatedText: String,
      nav: [NavItem!]
    }
 
  `);
};
exports.sourceNodes = ({ actions, createContentDigest }, pluginOptions) => {
  const { createNode } = actions;
  const options = defaultOptions(pluginOptions);
  const {
    sidebarDepth,
    editUrlText,
    shouldShowLastUpdated,
    lastUpdatedText,
    nav,
  } = options;
  const themeConfig = {
    sidebarDepth,
    editUrlText,
    shouldShowLastUpdated,
    lastUpdatedText,
    nav,
  };

  createNode({
    ...themeConfig,
    id: `gatsby-theme-primer-wiki-config`,
    parent: null,
    children: [],
    internal: {
      type: `PrimerWikiThemeConfig`,
      contentDigest: createContentDigest(themeConfig),
      content: JSON.stringify(themeConfig),
      description: `Options for gatsby-theme-primer-wiki`,
    },
  });
};
exports.createResolvers = ({ createResolvers }) => {
  const resolvers = {
    MdxFields: {
      fullPath: {
        type: "String",
        resolve(source, _, context) {
          const { pathPrefix } = context.nodeModel.getNodeById({
            type: "Site",
            id: "Site",
          });
          return urlJoin(pathPrefix || "/", source.slug);
        },
      },
      url: {
        type: "String",
        resolve(source, _, context) {
          const {
            siteMetadata: { siteUrl },
            pathPrefix,
          } = context.nodeModel.getNodeById({
            type: "Site",
            id: "Site",
          });
          const fullPath = urlJoin(pathPrefix || "/", source.slug);
          return urlJoin(siteUrl, fullPath);
        },
      },
    },
    MdxFrontmatter: {
      draft: {
        type: "Boolean",
        resolve(source) {
          return source.draft || false;
        },
      },
      title: {
        type: "String",
      },
      description: {
        type: "String",
      },
      date: {
        type: "Date",
      },
      tags: {
        type: "[String]",
        resolve(source) {
          return source.tags || [];
        },
      },
      imageAlt: {
        type: "String",
      },
      image: {
        type: "File",
      },
      category: {
        type: "String",
      },
      dateModified: {
        type: "Date",
      },
    },
  };
  createResolvers(resolvers);
};
exports.createPages = async ({ graphql, actions }, themeOptions) => {
  const postTemplate = path.resolve(__dirname, `./src/templates/post-query.js`);
  const { data } = await graphql(`
    {
      allMdx {
        nodes {
          fileAbsolutePath
          rawBody
          tableOfContents(maxDepth: 2)
          frontmatter {
            draft
          }
          fields {
            slug
          }
        }
      }
    }
  `);

  // Turn every MDX file into a page.
  return data.allMdx.nodes
    .filter((node) => node.frontmatter.draft !== true)
    .forEach((node) => {
      let slug = node.fields.slug;
      actions.createPage({
        path: slug,
        component: postTemplate,
        context: {
          slug: slug,
        },
      });
    });
};
exports.onCreateNode = async (
  { node, actions, getNode, loadNodeContent },
  themeOptions
) => {
  if (node.internal.type === `Mdx`) {
    const { createNodeField } = actions;
    const parentNode = getNode(node.parent);
    const options = defaultOptions(themeOptions);
    const title = await getTitle(node, { loadNodeContent });

    createNodeField({
      name: `title`,
      node,
      value: title || "",
    });
    let lastUpdated = "";
    let lastUpdatedAt = "";
    if (options.shouldShowLastUpdated) {
      try {
        const gitAuthorTime = execSync(
          `git log -1 --pretty=format:%aI ${node.fileAbsolutePath}`
        ).toString();
        const isoTime = new Date(gitAuthorTime).toISOString();
        lastUpdatedAt = isoTime;
        lastUpdated = options.lastUpdatedTransformer(isoTime);
      } catch (error) {
        // can not get git author time
      }
    }

    // try to get git create date
    let gitCreatedAt = "";
    try {
      const gitFirstAuthorTime = execSync(
        `git log --pretty=format:%aI ${node.fileAbsolutePath} | tail -1`
      ).toString();
      gitCreatedAt = new Date(gitFirstAuthorTime).toISOString();
    } catch (error) {
      // can not get git author time
    }
    const editUrl = getEditUrl(options.editUrl, parentNode.relativePath);
    actions.createNodeField({
      node,
      name: "lastUpdated",
      value: lastUpdated,
    });
    actions.createNodeField({
      node,
      name: "lastUpdatedAt",
      value: lastUpdatedAt,
    });
    actions.createNodeField({
      node,
      name: "gitCreatedAt",
      value: gitCreatedAt,
    });
    actions.createNodeField({
      node,
      name: "editUrl",
      value: editUrl,
    });
  }
};
function getEditUrl(baseEditUrl, filePath) {
  if (baseEditUrl && filePath) {
    return `${baseEditUrl}${filePath}`;
  } else {
    return "";
  }
}
