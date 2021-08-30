import * as React from "react";

const GeneralTags = (seoData) => {
  const { title, seoTitle, description, imageUrl, tags } = seoData;

  const htmlTags = [<title key="gen-title">{seoTitle || title}</title>];

  if (description)
    htmlTags.push(
      <meta name="description" content={description} key="gen-desc" />
    );

  if (imageUrl)
    htmlTags.push(<meta name="image" content={imageUrl} key="gen-image" />);

  if (tags && tags.length > 0) {
    htmlTags.push(
      <meta name="keywords" content={tags.join(", ")} key="gen-keywords" />
    );
  }
  return htmlTags;
};

export default GeneralTags;
