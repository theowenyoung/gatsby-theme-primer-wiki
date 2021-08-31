const getMdTitle = require("get-md-title");
const defaultOptions = (pluginOptions) => {
  const options = Object.assign(
    {
      nav: [],
      mdxOtherwiseConfigured: false, // advanced, use your own mdx plugin config, See https://github.com/theowenyoung/gatsby-theme-primer-wiki/blob/main/theme/gatsby-config.js#L31-L67
      extensions: [`.mdx`, ".md", ".markdown"], // supported file extensions for mdx
      imageMaxWidth: 561, // max width for image
      sidebarDepth: 0, // sidebar depth, default is 0;

      editUrl: "", // github/gitlab editurl, with prefix, example: 'https://github.com/facebook/docusaurus/edit/main/website/',
      editUrlText: "Edit this page", // edit url text
      shouldShowLastUpdated: true, // should show last updated
      shouldShowSidebarListOnIndex: true, // should show all articles at index.
      shouldSupportTags: true, // whether support tags
      rewriteUrlFileIgnore: [], // not rewrite `xxx.md`  to `xxx`
      rewriteToParentUrlFileIgnore: [], // not add parent path join for the file
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
