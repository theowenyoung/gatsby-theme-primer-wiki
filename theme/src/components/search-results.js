import { Box, Text } from "@primer/components";
import React from "react";
import { sentenceCase } from "sentence-case";
import useSiteMetadata from "../use-site";

function SearchResults({ results, getItemProps, highlightedIndex }) {
  const { siteMetadata } = useSiteMetadata();

  if (results.length === 0) {
    return (
      <Text as="div" p={3} fontSize={1} color="auto.gray.7" width="100%">
        No results
      </Text>
    );
  }

  return results.map((item, index) => {
    return (
      <Box
        display="flex"
        key={item.path}
        {...getItemProps({
          item,
          flexDirection: "column",
          flex: "0 0 auto",
          px: 3,
          py: 2,
          color: highlightedIndex === index ? "auto.white" : "auto.gray.8",
          bg: highlightedIndex === index ? "auto.blue.5" : "transparent",
          style: { cursor: "pointer" },
        })}
      >
        <Text
          fontSize={0}
          color={highlightedIndex === index ? "auto.blue.2" : "auto.gray.7"}
        >
          {getBreadcrumbs(siteMetadata.shortName, item.path).join(" / ")}
        </Text>
        {item.title}
      </Box>
    );
  });
}

function getBreadcrumbs(siteTitle, path) {
  return [
    siteTitle,
    ...path
      .split("/")
      .filter(Boolean)
      // The last title will be displayed separately, so we exclude it
      // from the breadcrumbs to avoid displaying it twice.
      .slice(0, -1)
      .map(sentenceCase),
  ];
}

export default SearchResults;
