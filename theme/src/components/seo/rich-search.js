import React from "react";

export const generateArticleMetadata = (postData) => {
  const {
    title,
    description,
    imageUrl,
    datePublished,
    dateModified,
    category,
    tags,
    body,
    url,
  } = postData;

  const orgMetaData = undefined;
  const authorData = undefined;

  if (!imageUrl || !description) return null;

  return {
    "@context": "http://schema.org",
    "@type": "BlogPosting",
    image: imageUrl,
    url,
    headline: title,
    name: title,
    description,
    dateCreated: datePublished,
    datePublished,
    dateModified,
    author: authorData,
    creator: authorData,
    publisher: orgMetaData,
    mainEntityOfPage: "True",
    keywords: tags,
    articleSection: category,
    articleBody: body,
  };
};

const RichSearchResultTags = ({ seoData, postData }) => {
  const { isArticle } = seoData;

  const articleJsonLd =
    isArticle && postData ? generateArticleMetadata(postData) : undefined;

  const orgJsonLd = undefined;

  const jsonLdData = isArticle ? articleJsonLd : orgJsonLd;

  return jsonLdData
    ? [
        <script key="rich-search" type="application/ld+json">
          {JSON.stringify(jsonLdData)}
        </script>,
      ]
    : [];
};

export default RichSearchResultTags;
