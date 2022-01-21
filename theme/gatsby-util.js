const getMdTitle = require("get-md-title");
const { arrayToTree } = require("performant-array-to-tree");
const { titleCase } = require("title-case");
const defaultOptions = (pluginOptions) => {
  const options = Object.assign(
    {
      nav: [],

      mdxOtherwiseConfigured: false, // advanced, use your own mdx plugin config, See https://github.com/theowenyoung/gatsby-theme-primer-wiki/blob/main/theme/gatsby-config.js#L31-L67
      remarkPlugins: [], // add gatsby-plugin-mdx remarkPlugins
      rehypePlugins: [], // add gatsby-plugin-mdx rehypePlugins
      gatsbyRemarkPlugins: [], // add gatsby-plugin-mdx gatsbyRemarkPlugins
      extensions: [`.mdx`, ".md", ".markdown"], // supported file extensions for mdx
      sidebarDefault: "auto", // first summary -> tags -> files tree , value can be auto, summary, tag, category
      sidebarComponents: [], // custom sitebar components, value can be summary, latest, tag, category, example: ["summary", "latest", "tag"], if this be defined, sidebarDefault will not work.
      imageMaxWidth: 561, // max width for image
      contentMaxWidth: 1440, // max width for content, including right sidebar
      sidebarDepth: 0, // sidebar depth, default is 0;
      summaryDepth: 1, // specify summary depth if exist
      summary1DepthIndent: false, // specify summary depth 0 indent, default false, not indent, when depth>1, it will indent
      editUrl: "", // github/gitlab editurl, with prefix, example: 'https://github.com/facebook/docusaurus/edit/main/website/',
      editUrlText: "Edit this page", // edit url text
      shouldShowLastUpdated: true, // should show last updated
      latestUpdatedText: "Recently Updated",
      shouldShowTagGroupsOnIndex: true, // should show tags list at index page
      shouldSupportTags: true, // whether support tags
      tagText: "Tags",
      categoryText: "Categories",
      shouldSupportLatest: true, // whether support latest posts, if true, theme will generate /latest/ page show latest updated posts.
      shouldShowLatestOnIndex: true, // should show latest posts on index,
      defaultIndexLatestPostCount: 10, // default latest posts on index count, default is 25
      rewriteUrlFileIgnore: [], // not rewrite `xxx.md`  to `xxx`
      rewriteToParentUrlFileIgnore: [], // not add parent path join for the file
      defaultColorMode: "day", // default color mode, auto, night, day
      searchBody: false, // is search body, default is false, if true, search will search all content, not only title
      lastUpdatedTransformer: (isoString) => {
        const dateObj = new Date(isoString);
        const date = dateObj.toLocaleString("en-US", {
          day: "numeric",
          month: "numeric",
          year: "numeric",
        });
        return date;
      },
      lastUpdatedText: "Last updated on",
    },
    pluginOptions
  );
  return options;
};
exports.defaultOptions = defaultOptions;

async function getTitle(node, { loadNodeContent }) {
  if (
    typeof node.frontmatter === "object" &&
    node.frontmatter &&
    "title" in node.frontmatter &&
    node.frontmatter["title"]
  ) {
    return {
      title: node.frontmatter["title"],
      shouldShowTitle: true,
    };
  }
  const content = await loadNodeContent(node);
  const result = getMdTitle(content);
  if (!result || !result.text) {
    // get file name

    if (node.fields && node.fields.slug) {
      const slugArr = node.fields.slug.split("/").filter((item) => item);
      const baseSlug = slugArr[slugArr.length - 1];
      if (!baseSlug) {
        return {
          title: "Index",
          shouldShowTitle: false,
        };
      }
      return {
        title: titleCase(baseSlug),
        shouldShowTitle: true,
      };
    }
  }
  return {
    title: result.text || "Untitled",
    shouldShowTitle: false,
  };
}
exports.getTitle = getTitle;
function formatTree(tree) {
  return tree.map((node) => {
    return {
      title: node.data.title,
      url: node.data.slug || "",
      items: node.children.length > 0 ? formatTree(node.children) : [],
    };
  });
}
exports.getTree = (nodes) => {
  // First add parent node
  const nodeMap = new Map();
  let allNodes = [];
  // first files, then folders
  // files may have index, so that should be handled first
  nodes.forEach((node) => {
    if (!nodeMap.get(node.slug)) {
      const arr = node.slug.split("/").filter((item) => item);

      nodeMap.set(node.slug, true);
      // last

      allNodes.push({
        id: node.slug,
        parentId:
          arr.length > 1
            ? "/" + arr.slice(0, arr.length - 1).join("/") + "/"
            : null,
        slug: node.slug,
        title: node.title,
      });
    }
  });
  nodes.forEach((node) => {
    const arr = node.slug.split("/").filter((item) => item);

    if (arr.length > 0) {
      arr.forEach((item, index) => {
        if (index < arr.length - 1) {
          const slug = "/" + arr.slice(0, index + 1).join("/") + "/";
          let parentSlug = "";
          if (arr.slice(0, index).length > 0) {
            parentSlug = "/" + arr.slice(0, index).join("/") + "/";
          }

          if (!nodeMap.get(slug)) {
            const title = titleCase(item);

            nodeMap.set(slug, true);
            allNodes.push({
              id: slug,
              parentId: parentSlug ? parentSlug : null,
              title: title,
            });
          }
        }
      });
    }
  });
  // console.log("allNodes", allNodes);
  // sort
  allNodes = allNodes.sort((a, b) => {
    return a.title.localeCompare(b.title);
  });
  const tree = arrayToTree(allNodes);

  return formatTree(tree);
};
