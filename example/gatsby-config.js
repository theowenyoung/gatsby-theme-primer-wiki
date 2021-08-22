const path = require("path");
const siteMetadata = {
  title: "Gatsby Theme Primer Wiki",
  shortName: "Wiki",
  description: "A Gatsby theme for creating Primer wiki sites",
  siteUrl: "https://wiki.demo.owenyoung.com",
};
module.exports = {
  siteMetadata,
  flags: {
    DEV_SSR: true,
  },
  plugins: [
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "content",
        path: path.resolve("./content5"),
      },
    },
    {
      resolve: "gatsby-plugin-robots-txt",
      options: {
        policy: [{ userAgent: "*", disallow: "/" }],
      },
    },
    {
      resolve: "gatsby-theme-primer-wiki",
      options: {
        sidebarDepth: 1,
        editUrl:
          "https://github.com/theowenyoung/gatsby-theme-primer-wiki/tree/main/example/content/",
      },
    },
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "./static/logo.png",
      },
    },
  ],
};
