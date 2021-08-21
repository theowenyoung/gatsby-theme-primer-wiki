import React from "react";
import Reference from "./reference";
import { Box, Heading, StyledOcticon } from "@primer/components";
import { LinkIcon } from "@primer/octicons-react";

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
      <div>
        {references.map((ref) => (
          <Reference node={ref} key={ref.fields.slug} />
        ))}
      </div>
    </Box>
  );
};

export default ReferencesBlock;
