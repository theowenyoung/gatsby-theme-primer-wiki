import { graphql } from "gatsby";
import LatestPage from "../components/latest-page";

export default LatestPage;

export const query = graphql`
  query latestQuery {
    site {
      pathPrefix
      siteMetadata {
        siteUrl
      }
    }
    allMdx {
      nodes {
        frontmatter {
          title
          draft
        }
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
