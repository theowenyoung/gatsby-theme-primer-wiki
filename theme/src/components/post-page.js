import React from 'react'
import {MDXRenderer} from 'gatsby-plugin-mdx'
import Layout from './layout'
import ReferencesBlock from './references-block'
import {MDXProvider} from '@mdx-js/react'
import components from './mdx-components'
const Post = ({data, pageContext}) => {
  const post = data.mdx
  const tableOfContents = post.tableOfContents
  const frontmatter = post.frontmatter
  const fields = post.fields
  const AnchorTag = props => (
    <components.a {...props} references={post.outboundReferences} />
  )
  return (
    <Layout
      fields={fields}
      frontmatter={frontmatter}
      tableOfContents={tableOfContents}
      pageContext={pageContext}
    >
      <MDXProvider components={{a: AnchorTag}}>
        <MDXRenderer>{post.body}</MDXRenderer>
      </MDXProvider>
      <ReferencesBlock references={post.inboundReferences} />
    </Layout>
  )
}
export default Post
