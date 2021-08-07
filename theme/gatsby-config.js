const path = require('path')
const {defaultOptions} = require('./gatsby-util')
module.exports = themeOptions => {
  const {mdxOtherwiseConfigured, parseWikiLinks, extensions} = defaultOptions(
    themeOptions,
  )
  return {
    siteMetadata: {
      title: 'Doctocat',
      shortName: 'Doctocat',
      description: 'A Gatsby theme for creating Primer documentation sites',
      imageUrl:
        'https://user-images.githubusercontent.com/10384315/53922681-2f6d3100-402a-11e9-9719-5d1811c8110a.png',
    },
    plugins: [
      {
        resolve: 'gatsby-source-filesystem',
        options: {
          name: 'content',
          path: path.resolve('./content'),
        },
      },
      'gatsby-plugin-styled-components',
      'gatsby-plugin-react-helmet',
      'gatsby-plugin-catch-links',
      'gatsby-transformer-summary',
      !mdxOtherwiseConfigured && `gatsby-plugin-sharp`,
      !mdxOtherwiseConfigured && `gatsby-remark-images`,
      !mdxOtherwiseConfigured && {
        resolve: `gatsby-plugin-mdx`,
        options: {
          extensions: extensions,
          gatsbyRemarkPlugins: [
            {
              resolve: 'gatsby-remark-double-brackets-link',
              options: {parseWikiLinks},
            },
            'gatsby-remark-double-parenthesis-link',
            {
              resolve: `gatsby-remark-images`,
              options: {
                maxWidth: 561,
              },
            },
            {
              resolve: `gatsby-remark-copy-linked-files`,
              options: {
                ignoreFileExtensions: extensions
                  .map(item => item.slice(1))
                  .concat([`png`, `jpg`, `jpeg`, `bmp`, `tiff`]),
              },
            },

            {
              resolve: `gatsby-remark-autolink-headers`,
              options: {
                icon: false,
              },
            },
          ],
        },
      },
      `gatsby-transformer-markdown-references`,
      {
        resolve: 'gatsby-plugin-manifest',
        options: {
          icon: themeOptions.icon
            ? path.resolve(themeOptions.icon)
            : require.resolve('./src/images/favicon.png'),
        },
      },
    ],
  }
}
