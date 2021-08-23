import * as React from "react";

const GeneralTags = (seoData) => {
  const { title, description, imageUrl } = seoData;

  const tags = [<title key="gen-title">{title}</title>];

  if (description)
    tags.push(<meta name="description" content={description} key="gen-desc" />);

  if (imageUrl)
    tags.push(<meta name="image" content={imageUrl} key="gen-image" />);

  return tags;
};

export default GeneralTags;
