const getMdTitle = require("get-md-title");
const defaultOptions = (pluginOptions) => {
  const options = Object.assign(
    {
      extensions: [`.mdx`, ".md", ".markdown"],
      mdxOtherwiseConfigured: false,
      nav: [],
      imageMaxWidth: 561,
      sidebarDepth: 1,
      editUrl: "", // 'https://github.com/facebook/docusaurus/edit/main/website/',
      editUrlText: "Edit this page",
      shouldShowLastUpdated: true,
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
