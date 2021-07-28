module.exports = {
  siteMetadata: {
    title: 'Gatsby Theme Primer Wiki',
    shortName: 'Wiki',
    description: 'A Gatsby theme for creating Primer wiki sites',
  },
  flags: {
    DEV_SSR: true,
  },
  plugins: [
    {
      resolve: 'gatsby-theme-primer-wiki',
      options: {
        repoRootPath: '..',
      },
    },
  ],
}
