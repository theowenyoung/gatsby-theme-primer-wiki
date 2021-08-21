import React from "react";
import { Box } from "@primer/components";
import AnchorTag from "./anchor-tag";
const Reference = ({ node }) => {
  return (
    <Box mb="2">
      <AnchorTag href={node.fields.slug} references={[node]}>
        {node.fields.title || node.fields.slug}
      </AnchorTag>
    </Box>
  );
};

export default Reference;
