import React from "react";
import { Box, Heading, StyledOcticon } from "@primer/components";
import { LinkIcon } from "@primer/octicons-react";
import components from "./mdx-components";
import ReferenceLi from "./reference-li";

const ReferencesBlock = ({ references }) => {
  if (!references.length) {
    return null;
  }

  return (
    <Box bg="auto.gray.1" borderRadius="2" px="3" py="4" mt="4">
      <Heading as="h4" fontSize="2" mb="3" color="text.placeholder">
        <StyledOcticon
          mr={2}
          size={16}
          sx={{
            top: "-3px",
            position: "relative",
          }}
          icon={LinkIcon}
          color="text.placeholder"
        />
        LINKS TO THIS PAGE
      </Heading>
      <components.ul style={{ paddingLeft: "16px", listStyle: "none" }}>
        {references.map((node) => (
          <ReferenceLi key={node.fields.slug}>
            <components.a href={node.fields.slug} references={[node]}>
              {node.fields.title || node.fields.slug}
            </components.a>
          </ReferenceLi>
        ))}
      </components.ul>
    </Box>
  );
};

export default ReferencesBlock;
