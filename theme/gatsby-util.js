const getMdTitle = require("get-md-title");
const defaultOptions = (pluginOptions) => {
  const options = Object.assign(
    {
      extensions: [`.mdx`, ".md", ".markdown"], // supported file extensions for mdx
      nav: [],
      imageMaxWidth: 561,
      sidebarDepth: 0,
      editUrl: "", // 'https://github.com/facebook/docusaurus/edit/main/website/',
      editUrlText: "Edit this page",
      shouldShowLastUpdated: true,
      shouldShowSidebarListOnIndex: true,
      shouldSupportTags: true,
      rewriteUrlFileIgnore: [],
      rewriteToParentUrlFileIgnore: [],
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
      mdxOtherwiseConfigured: false, // advanced, use your own mdx plugin config, See https://github.com/theowenyoung/gatsby-theme-primer-wiki/blob/main/theme/gatsby-config.js#L31-L67
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
    return node.frontmatter["title"];
  }
  const content = await loadNodeContent(node);
  const result = getMdTitle(content);
  if (!result) {
    return "Untitled";
  }
  return result.text || "Untitled";
}
exports.getTitle = getTitle;
