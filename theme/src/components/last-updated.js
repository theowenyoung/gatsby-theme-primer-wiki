import { Text } from "@primer/components";
import React from "react";
import { graphql, useStaticQuery } from "gatsby";

// The `contributors` array is fetched in gatsby-node.js at build-time.

function LastUpdated({ lastUpdated }) {
  const data = useStaticQuery(graphql`
    {
      primerWikiThemeConfig(id: { eq: "gatsby-theme-primer-wiki-config" }) {
        shouldShowLastUpdated
        lastUpdatedText
      }
    }
  `);
  const { primerWikiThemeConfig } = data;
  const { lastUpdatedText, shouldShowLastUpdated } = primerWikiThemeConfig;
  if (!shouldShowLastUpdated) {
    return null;
  }
  return (
    <div>
      {lastUpdated ? (
        <Text fontSize={1} color="auto.gray.7" mt={1}>
          {lastUpdatedText} <b>{lastUpdated}</b>
        </Text>
      ) : null}
    </div>
  );
}

export default LastUpdated;
