import React from "react";

// This function acts as a type guard to prevent undefined content from being added
const addTag = (tagList, property, content) => {
  tagList.push(<meta property={property} content={content} />);
};

const createArticleTagList = (postData) => {
  const metaTags = [];
  if (postData.datePublished) {
    addTag(
      metaTags,
      "article:published_time",
      postData.datePublished.toISOString()
    );
  }
  if (postData.dateModified) {
    addTag(
      metaTags,
      "article:modified_time",
      postData.dateModified.toISOString()
    );
  }

  addTag(
    metaTags,
    "article:author",
    "http://examples.opengraphprotocol.us/profile.html"
  );

  addTag(metaTags, "article:section", postData.category);

  postData.tags.forEach((tag) => {
    addTag(metaTags, "article:tag", tag);
  });

  return metaTags;
};

const OpenGraphTags = ({ seoData, siteMetadata, postData }) => {
  const { isArticle, type, title, imageUrl, imageAlt, url, description } =
    seoData;

  const siteName = siteMetadata.name;

  if (!imageUrl || !imageAlt) return [];

  const metaTags = [];

  addTag(metaTags, "og:title", title);
  addTag(metaTags, "og:type", type);
  addTag(metaTags, "og:url", url);
  addTag(metaTags, "og:image", imageUrl);
  addTag(metaTags, "og:image:alt", imageAlt);
  addTag(metaTags, "og:site_name", siteName);

  if (description) addTag(metaTags, "og:description", description);

  if (siteMetadata.fbAppId) addTag(metaTags, "fb:app_id", siteMetadata.fbAppId);

  if (isArticle && postData) metaTags.push(...createArticleTagList(postData));

  // Add unique keys and return
  return metaTags.map((tag) => ({
    ...tag,
    key: `${tag.props.property}-${tag.props.content}`,
  }));
};

export default OpenGraphTags;
