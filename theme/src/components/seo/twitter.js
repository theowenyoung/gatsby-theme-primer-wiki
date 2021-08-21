import React from "react";

const TwitterTags = ({ seoData, siteMetadata }) => {
  const { title, description, imageUrl, imageAlt } = seoData;
  const userTwitterName = siteMetadata?.twitterName;
  const siteTwitterName = siteMetadata.twitterName;

  const tagList = [];

  // This function acts as a type guard to prevent undefined content from being added
  const addTag = (name, content) => {
    tagList.push(<meta name={name} content={content} />);
  };

  addTag("twitter:card", "summary_large_image");
  addTag("twitter:title", title);

  if (description) addTag("twitter:description", description);

  if (imageUrl) addTag("twitter:image", imageUrl);

  addTag("twitter:image:alt", imageAlt);

  if (userTwitterName) addTag("twitter:creator", userTwitterName);

  if (siteTwitterName) addTag("twitter:site", siteTwitterName);

  return tagList.map((tag) => ({
    ...tag,
    key: tag.props.name,
  }));
};

export default TwitterTags;
