import { useStaticQuery, graphql } from "gatsby";

function useThemeConfig() {
  const data = useStaticQuery(graphql`
    {
      primerWikiThemeConfig(id: { eq: "gatsby-theme-primer-wiki-config" }) {
        shouldShowLastUpdated
        contentMaxWidth
        lastUpdatedText
        sidebarDepth
        editUrlText
        shouldShowTagGroupsOnIndex
        shouldSupportTags
        titleTemplate
        defaultColorMode
        shouldShowLatestOnIndex
        nav {
          title
          url
          items {
            title
            url
          }
        }
        icon {
          childImageSharp {
            gatsbyImageData(width: 32, height: 32)
          }
        }
      }
    }
  `);
  return data.primerWikiThemeConfig;
}

export default useThemeConfig;
