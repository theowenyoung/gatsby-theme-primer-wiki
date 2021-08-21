import React from "react";
import { Helmet } from "react-helmet";
import GeneralTags from "./general";
import OpenGraphTags from "./open-graph";
import RichSearchTags from "./rich-search.js";
import TwitterTags from "./Twitter";
import { generatePostData, generateSeoData } from "./utils";
import useSiteMetadata from "../../use-site";

const SEO = ({ post }) => {
  const { siteMetadata, pathPrefix } = useSiteMetadata();

  const postData = post ? generatePostData(post) : undefined;

  const seoData = generateSeoData(siteMetadata, postData, {
    pathPrefix,
  });

  const tagList = [
    ...GeneralTags(seoData, siteMetadata),
    ...OpenGraphTags({ seoData, siteMetadata, postData }),
    ...RichSearchTags({ seoData, postData }),
    ...TwitterTags({ seoData, siteMetadata }),
  ];

  return (
    <Helmet
      htmlAttributes={{
        lang:
          postData && postData.language
            ? postData.language
            : siteMetadata.language || "en",
      }}
    >
      {tagList}
    </Helmet>
  );
};

export default SEO;
