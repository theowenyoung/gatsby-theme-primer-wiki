import {graphql} from 'gatsby'
import PostPage from '../components/post-page'

export default PostPage

export const query = graphql`
  query PostQuery($slug: String!) {
    mdx(fields: {slug: {eq: $slug}}) {
      id
      tableOfContents(maxDepth: 2)
      frontmatter {
        title
        description
        status
        additionalContributors
      }
      body
    }
  }
`
