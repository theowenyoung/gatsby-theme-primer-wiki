import React from 'react'
import {MDXRenderer} from 'gatsby-plugin-mdx'
import Layout from './layout'

const Post = ({location, data, pageContext}) => {
  const post = data.mdx
  const tableOfContents = post.tableOfContents
  const frontmatter = post.frontmatter
  return (
    <Layout
      frontmatter={frontmatter}
      tableOfContents={tableOfContents}
      pageContext={pageContext}
    >
      <MDXRenderer>{post.body}</MDXRenderer>
    </Layout>
  )
}
export default Post
