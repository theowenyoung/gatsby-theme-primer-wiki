const path = require("path");
const { execSync } = require("child_process");
const { getTitle, defaultOptions, getTree } = require("./gatsby-util");
const urlJoin = require("url-join");
const kebabCase = require(`lodash/kebabCase`);
const { createFileNodeFromBuffer } = require("gatsby-source-filesystem");
const fs = require("fs");
const datefn = require("date-fns");
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
      sidebarDepth: Int
      contentMaxWidth: Int
      editUrlText: String
      shouldShowLastUpdated: Boolean
      shouldSupportTags: Boolean
      lastUpdatedText: String
      nav: [NavItem!]
      titleTemplate: String
      defaultColorMode: String
      shouldShowTagGroupsOnIndex:Boolean
      icon: File,
      latestUpdatedText: String
      tagText: String
      searchBody: Boolean
    }
 
  `);
};

exports.sourceNodes = async (gatsbyFunctions, pluginOptions) => {
  const {
    actions: { createNode },
    createNodeId,
    store,
    cache,

    createContentDigest,
  } = gatsbyFunctions;
  const options = defaultOptions(pluginOptions);
  const {
    sidebarDepth,
    contentMaxWidth,
    editUrlText,
    shouldShowLastUpdated,
    lastUpdatedText,
    shouldShowTagGroupsOnIndex,
    nav,
    shouldSupportTags,
    titleTemplate,
    defaultColorMode,
    shouldShowLatestOnIndex,
    icon,
    latestUpdatedText,
    tagText,
    searchBody,
  } = options;
  const themeConfig = {
    sidebarDepth,
    contentMaxWidth,
    editUrlText,
    shouldShowLastUpdated,
    shouldShowTagGroupsOnIndex,
    lastUpdatedText,
    shouldSupportTags,
    nav,
    titleTemplate,
    shouldShowLatestOnIndex,
    defaultColorMode,
    latestUpdatedText,
    tagText,
    searchBody,
  };
  // create icon node
  if (icon) {
    const buffer = fs.readFileSync(icon);

    const fileNode = await createFileNodeFromBuffer({
      buffer,
      store,
      cache,
      createNode,
      createNodeId,
      name: "site-icon",
    });
    themeConfig.icon = fileNode;
  }

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
      seoTitle: {
        type: "String",
      },
      description: {
        type: "String",
      },
      language: {
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
  const options = defaultOptions(themeOptions);
  const {
    shouldSupportLatest,
    latestUpdatedText,
    sidebarComponents,
    sidebarDefault,
    tagText,
    categoryText,
    summaryDepth,
    summary1DepthIndent,
  } = options;
  const postTemplate = path.resolve(__dirname, `./src/templates/post-query.js`);

  const tagTemplate = path.resolve(__dirname, `./src/templates/tag-query.js`);
  const latestTemplate = path.resolve(
    __dirname,
    `./src/templates/latest-query.js`
  );

  const postsData = await graphql(`
    {
      allSummaryGroup {
        nodes {
          title
          items {
            title
            url
            external
            items {
              title
              url
              external
              items {
                title
                url
                external
                items {
                  title
                  url
                  external
                }
              }
            }
          }
        }
      }
    }
  `);
  let tagsGroups = [];
  if (options.shouldSupportTags) {
    const tagsData = await graphql(`
      {
        tagsGroup: allMdx {
          group(field: frontmatter___tags) {
            fieldValue
            nodes {
              id
              frontmatter {
                draft
              }
              fields {
                slug
                title
              }
            }
          }
        }
      }
    `);

    tagsGroups = tagsData.data.tagsGroup.group
      .filter((item) => {
        const validPosts = item.nodes.filter((child) => {
          return child.frontmatter.draft !== true;
        });
        if (validPosts.length > 0) {
          return true;
        } else {
          return false;
        }
      })
      .map((item) => {
        const validPosts = item.nodes.filter((child) => {
          return child.frontmatter.draft !== true;
        });
        return {
          ...item,
          nodes: validPosts,
        };
      })
      .map((item) => {
        return {
          title: `${item.fieldValue}`,
          type: "tag",
          url: `/tags/${kebabCase(item.fieldValue)}/`,
          items: item.nodes.map((child) => {
            return {
              title: child.fields.title,
              url: child.fields.slug,
            };
          }),
        };
      });
  }

  let summarySidebars = postsData.data.allSummaryGroup.nodes.map((item) => {
    return formatSummaryDepth(item, {
      sidebarDepth: summaryDepth,
      currentDepth: 0,
      summary1DepthIndent: summary1DepthIndent,
    });
  });
  //
  let sidebarItems = [];
  const { data } = await graphql(`
    {
      allMdx {
        nodes {
          fileAbsolutePath
          rawBody
          tableOfContents(maxDepth: 2)
          frontmatter {
            draft
            tags
          }
          fields {
            slug
            title
            lastUpdatedAt
            lastUpdated
          }
        }
      }
    }
  `);
  const allPostNodes = data.allMdx.nodes.filter(
    (node) => node.frontmatter.draft !== true
  );

  const latestPosts = allPostNodes
    .sort((a, b) => {
      const aDate = new Date(a.fields.lastUpdatedAt || 0).getTime();
      const bDate = new Date(b.fields.lastUpdatedAt || 0).getTime();
      return bDate - aDate;
    })
    .slice(0, options.defaultIndexLatestPostCount)
    .map((node) => {
      return {
        fields: node.fields,
        frontmatter: node.frontmatter,
      };
    });

  // auto generate summary
  const tree = getTree(
    allPostNodes.map((node) => {
      return {
        slug: node.fields.slug,
        title: node.fields.title,
      };
    })
  );
  // console.log("tree", JSON.stringify(tree, null, 2));
  const categorySidebars = [{ title: categoryText, items: tree }];

  if (sidebarComponents && sidebarComponents.length > 0) {
    // use sidebarComponents

    sidebarComponents.forEach((item) => {
      if (item === "summary") {
        sidebarItems = sidebarItems.concat(summarySidebars);
      } else if (item === "tag") {
        sidebarItems.push({
          title: tagText,
          items: tagsGroups,
        });
      } else if (item === "category") {
        sidebarItems.push(categorySidebars[0]);
      } else if (item === "latest") {
        sidebarItems.push({
          title: "",
          items: [
            {
              title: latestUpdatedText,
              url: "/latest/",
              collapse: true,
              indent: false,
              items: latestPosts.map((item) => {
                const date = datefn.format(
                  new Date(item.fields.lastUpdatedAt),
                  "MM-dd"
                );
                let title = item.fields.title;
                if (date) {
                  title = `${date}: ${title}`;
                }
                return {
                  title: title,
                  url: item.fields.slug,
                };
              }),
            },
          ],
        });
      }
    });
  } else {
    sidebarItems = summarySidebars;
    if (
      (sidebarItems.length === 0 && tagsGroups.length === 0) ||
      sidebarDefault === "category"
    ) {
      sidebarItems = categorySidebars;
    } else if (sidebarDefault === "tag") {
      sidebarItems = [
        {
          title: tagText,
          items: tagsGroups,
        },
      ];
    }
  }

  if (shouldSupportLatest) {
    actions.createPage({
      path: "/latest/",
      component: latestTemplate,
      context: {
        slug: "/latest/",
        sidebarItems,
        tagsGroups,
      },
    });
  }

  tagsGroups.forEach((item) => {
    let tag = item.title;
    const slug = item.url;
    actions.createPage({
      path: slug,
      component: tagTemplate,
      context: {
        slug: slug,
        tag: tag,
        sidebarItems,
        tagsGroups,
      },
    });
  });

  // Turn every MDX file into a page.
  return allPostNodes.forEach((node) => {
    let slug = node.fields.slug;

    actions.createPage({
      path: slug,
      component: postTemplate,
      context: {
        tags: node.frontmatter.tags || [],
        slug: slug,
        sidebarItems,
        tagsGroups,
        latestPosts,
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
    const { title, shouldShowTitle } = await getTitle(node, {
      loadNodeContent,
    });

    createNodeField({
      name: `title`,
      node,
      value: title || "",
    });
    createNodeField({
      name: `shouldShowTitle`,
      node,
      value: shouldShowTitle,
    });
    let lastUpdated = "";
    let lastUpdatedAt = "";
    if (options.shouldShowLastUpdated) {
      try {
        const gitAuthorTime = execSync(
          `git log -1 --pretty=format:%aI "${node.fileAbsolutePath}"`
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
        `git log --pretty=format:%aI "${node.fileAbsolutePath}" | tail -1`
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
function formatSummaryDepth(
  sidebar,
  { sidebarDepth, currentDepth, summary1DepthIndent }
) {
  if (currentDepth === undefined) {
    currentDepth = 0;
  }
  if (currentDepth === 1) {
    sidebar.indent = summary1DepthIndent;
  }
  if (sidebar.items && sidebar.items.length > 0) {
    if (currentDepth <= sidebarDepth) {
      sidebar.collapse = true;
    }
    sidebar.items.map((item) => {
      return formatSummaryDepth(item, {
        sidebarDepth,
        currentDepth: currentDepth + 1,
        summary1DepthIndent,
      });
    });
  }
  return sidebar;
}
