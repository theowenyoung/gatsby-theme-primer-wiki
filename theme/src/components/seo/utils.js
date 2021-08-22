import removeMd from "remove-markdown";
// Generate postData from a allMdx edge
export const generatePostData = (post) => {
  const {
    coverImageUrl,
    coverImageAlt,
    datePublished,
    dateModified,
    description,
    title,
    category,
    tags,
    rawBody,
    excerpt,
    slug,
    frontmatterTitle,
  } = post;

  if (!rawBody)
    throw Error(
      "SEO::generatePostData: Post doesn't contain internal content used for Rich Tags. Aborting."
    );

  const body = removeMd(rawBody);
  let postDescription = "";
  if (description) {
    postDescription = description;
  } else {
    postDescription = excerpt;
    if (!frontmatterTitle && title && postDescription.startsWith(title)) {
      postDescription = postDescription.slice(title.length);
      if (postDescription && postDescription.startsWith(" ")) {
        // remove title space
        postDescription = postDescription.slice(1);
      }
    }
  }

  return {
    slug,
    title,
    description: postDescription,
    coverImageUrl,
    coverImageAlt,
    datePublished,
    dateModified,
    category: category || "None",
    tags: tags || [],
    body,
    url: post.url,
  };
};

// Generate shared SEO metadata
export const generateSeoData = (siteMetadata, postData, { pathPrefix }) => {
  const isArticle = !!postData;
  const title = postData ? postData.title : siteMetadata.title;
  const type = postData && postData.slug !== "/" ? "article" : "website";
  const imageUrl = postData ? postData.coverImageUrl : siteMetadata.imageUrl;
  const imageAlt = postData ? postData.coverImageAlt : siteMetadata.description;
  if (!pathPrefix) {
    pathPrefix = "/";
  }

  // const realSiteUrl = urlJoin(siteMetadata.siteUrl, pathPrefix);
  const url = postData ? postData.url : "";
  const description = postData
    ? postData.description
    : siteMetadata.description;

  return {
    isArticle,
    type,
    title,
    imageUrl,
    imageAlt,
    url,
    description,
  };
};
