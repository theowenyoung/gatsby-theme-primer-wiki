const { defaultOptions } = require("./gatsby-util");
const path = require("path");
module.exports = (themeOptions) => {
  const {
    mdxOtherwiseConfigured,
    imageMaxWidth,
    extensions,
    rewriteUrlFileIgnore,
    rewriteToParentUrlFileIgnore,
    gatsbyRemarkPlugins,
    remarkPlugins,
    rehypePlugins,
  } = defaultOptions(themeOptions);
  let plugins = [
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "gatsby-theme-primer-wiki-placeholder",
        path: path.resolve(__dirname, `./src/placeholder`),
      },
    },
    "@theowenyoung/gatsby-plugin-slug",
    "gatsby-plugin-styled-components",
    "gatsby-plugin-react-helmet",
    "gatsby-transformer-summary",
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`, // Needed for dynamic images
    `gatsby-remark-images`,
  ];
  if (!mdxOtherwiseConfigured) {
    plugins.push({
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: extensions,
        remarkPlugins: [
          require("remark-inline-links"),
          require("remark-unwrap-images"),
          ...remarkPlugins,
        ],
        rehypePlugins: [...rehypePlugins],
        gatsbyRemarkPlugins: [
          {
            resolve: "gatsby-remark-rewrite-link-for-trailing-slash",
            options: {
              fileIgnore: rewriteUrlFileIgnore,
              rewriteToParentUrlFileIgnore: rewriteToParentUrlFileIgnore,
            },
          },

          {
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              icon: false,
            },
          },
          {
            resolve: `gatsby-remark-relative-images`,
            options: {
              include: ["image"],
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: imageMaxWidth,
              showCaptions: ["title", "alt"],
            },
          },
          {
            resolve: `gatsby-remark-copy-linked-files`,
            options: {
              ignoreFileExtensions: extensions
                .map((item) => item.slice(1))
                .concat([
                  `.png`,
                  `.jpg`,
                  `.jpeg`,
                  `.bmp`,
                  `.tiff`,
                  ".svg",
                  ".gif",
                ]),
            },
          },
          ...gatsbyRemarkPlugins,
        ],
      },
    });
  }
  plugins.push(`@theowenyoung/gatsby-transformer-references`);
  return {
    siteMetadata: {
      title: "Gatsby Theme Primer Wiki",
      shortName: "Wiki",
      description: "A Gatsby theme for creating Primer wiki sites",
      fbAppId: "",
      imageUrl:
        "https://user-images.githubusercontent.com/10384315/53922681-2f6d3100-402a-11e9-9719-5d1811c8110a.png",
    },
    plugins: plugins,
  };
};
