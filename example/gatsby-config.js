const siteMetadata = {
  title: "Gatsby Theme Primer Wiki",
  shortName: "Wiki",
  description: "A Gatsby theme for creating Primer wiki sites",
  siteUrl: "https://wiki.demo.owenyoung.com"
};
module.exports = {
  siteMetadata,
  flags: {
    DEV_SSR: true
  },
  plugins: [
    {
      resolve: "gatsby-theme-primer-wiki",
      options: {
        sidebarDepth: 0,
        editUrl:
          "https://github.com/theowenyoung/gatsby-theme-primer-wiki/tree/main/example/content/"
      }
    }
  ]
};
