import { graphql } from "gatsby";
import TagPage from "../components/tag-page";

export default TagPage;

export const query = graphql`
  query tagQuery($tag: String) {
    site {
      pathPrefix
      siteMetadata {
        siteUrl
      }
    }
    allMdx(filter: { frontmatter: { tags: { eq: $tag } } }) {
      nodes {
        frontmatter {
          title
        }
        body
        fields {
          slug
          title
          lastUpdated
          lastUpdatedAt
          gitCreatedAt
        }
      }
    }
  }
`;
