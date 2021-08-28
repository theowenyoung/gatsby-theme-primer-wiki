import React from "react";
import Layout from "./layout";
import SEO from "./seo";
import { Box } from "@primer/components";
import urlJoin from "url-join";
import TagPosts from "./tag-posts";
const Tag = ({ data, pageContext, location }) => {
  const pathPrefix = data.site.pathPrefix || "";
  const slug = pageContext.slug;
  const fullPath = urlJoin(pathPrefix || "/", slug);
  const siteUrl = data.site.siteMetadata.siteUrl;
  const fullUrl = urlJoin(siteUrl, fullPath);
  const posts = data.allMdx.nodes.sort((a, b) => {
    const aDate = new Date(a.fields.lastUpdatedAt || 0).getTime();
    const bDate = new Date(b.fields.lastUpdatedAt || 0).getTime();
    return bDate - aDate;
  });
  let firstPublistedAt = null;
  let dateModified = null;
  if (posts.length > 0) {
    if (posts[posts.length - 1].fields.gitCreatedAt) {
      firstPublistedAt = new Date(posts[posts.length - 1].fields.gitCreatedAt);
    }
    if (posts[0].fields.lastUpdatedAt) {
      dateModified = new Date(posts[0].fields.lastUpdatedAt);
    }
  }
  const tag = pageContext.tag;
  const title = `#${tag}`;
  const palinBody = posts.map((post) => post.fields.title).join(", ");
  const description = `All posts about #${tag}, ${palinBody.slice(0, 256)}`;
  const postSeoData = {
    title,
    frontmatterTitle: "",
    description,
    rawBody: palinBody,
    excerpt: description,
    datePublished: firstPublistedAt,
    dateModified: dateModified,
    category: tag,
    imageUrl: null,
    imageAlt: "",
    url: fullUrl,
    slug: slug,
    tags: [tag],
  };
  return (
    <Layout pageContext={pageContext} location={location}>
      <SEO post={postSeoData}></SEO>
      <Box p={[4, 5, 6, 7]}>
        <TagPosts
          nodes={data.allMdx.nodes}
          tag={tag}
          shouldShowInstantView
        ></TagPosts>
      </Box>
    </Layout>
  );
};
export default Tag;
