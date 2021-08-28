import { graphql } from "gatsby";
import PostPage from "../components/post-page";

export default PostPage;

export const query = graphql`
  query PostQuery($slug: String!) {
    primerWikiThemeConfig(id: { eq: "gatsby-theme-primer-wiki-config" }) {
      shouldShowSidebarListOnIndex
    }
    mdx(fields: { slug: { eq: $slug } }) {
      id
      tableOfContents(maxDepth: 2)
      fields {
        title
        slug
        url
        editUrl
        lastUpdatedAt
        lastUpdated
        gitCreatedAt
      }
      frontmatter {
        title
        description
        imageAlt
        tags
        date
        dateModified
        image {
          publicURL
          childImageSharp {
            gatsbyImageData
          }
        }
      }
      body
      rawBody
      excerpt(truncate: true)
      outboundReferences {
        ... on Mdx {
          body
          frontmatter {
            title
          }
          fields {
            slug
            title
          }
        }
      }
      inboundReferences {
        ... on Mdx {
          body
          frontmatter {
            title
          }
          fields {
            slug
            title
          }
        }
      }
    }
  }
`;
