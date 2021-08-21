import React from "react";
import { MDXRenderer } from "gatsby-plugin-mdx";
import Layout from "./layout";
import ReferencesBlock from "./references-block";
import { MDXProvider } from "@mdx-js/react";
import components from "./mdx-components";
import SEO from "./seo";

const Post = ({ data, pageContext, location }) => {
  const post = data.mdx;

  const {
    tableOfContents,
    frontmatter,
    fields,
    rawBody,
    body,
    inboundReferences,
    outboundReferences,
    excerpt
  } = post;

  const { title, lastUpdatedAt, gitCreatedAt, slug, url } = fields;
  const { date, description, imageAlt, dateModified } = frontmatter;
  const category = getCategory(slug, data.allSummaryGroup.nodes);
  const datePublished = date
    ? new Date(date)
    : gitCreatedAt
    ? new Date(gitCreatedAt)
    : null;
  const postSeoData = {
    title,
    description,
    rawBody,
    excerpt,
    datePublished,
    dateModified: dateModified
      ? new Date(dateModified)
      : lastUpdatedAt
      ? new Date(lastUpdatedAt)
      : datePublished,
    category,
    imageUrl: frontmatter.image ? frontmatter.image.publicURL : null,
    imageAlt: imageAlt,
    url,
    slug
  };
  const AnchorTag = props => (
    <components.a {...props} references={outboundReferences} />
  );
  return (
    <Layout
      fields={fields}
      frontmatter={frontmatter}
      tableOfContents={tableOfContents}
      pageContext={pageContext}
      location={location}
    >
      <SEO post={postSeoData}></SEO>
      <MDXProvider components={{ a: AnchorTag }}>
        <MDXRenderer>{body}</MDXRenderer>
      </MDXProvider>
      <ReferencesBlock references={inboundReferences} />
    </Layout>
  );
};
export default Post;
function getMatchNode(url, items, title) {
  if (items && items.length > 0) {
    let matchedTitle = "";
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.url === url) {
        matchedTitle = title;
      } else if (item.items) {
        matchedTitle = getMatchNode(url, item.items, item.title);
      }
      if (matchedTitle) {
        return matchedTitle;
      }
    }
    return null;
  } else {
    return null;
  }
}
function getCategory(url, allNodes) {
  let realNodes = allNodes.map(nodeGroup => nodeGroup.items);
  for (let i = 0; i < realNodes.length; i++) {
    const currentGroup = realNodes[i];
    const category = getMatchNode(url, currentGroup);
    if (category) {
      return category;
    }
  }
  return null;
}
