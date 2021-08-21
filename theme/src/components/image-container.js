import { Box } from "@primer/components";
import React from "react";

function ImageContainer({ children }) {
  return (
    <Box
      borderWidth="1px"
      borderStyle="solid"
      borderColor="border.primary"
      borderRadius={2}
      p={6}
      bg="auto.gray.1"
    >
      <Box
        display="flex"
        justifyContent="center"
        sx={{ img: { maxWidth: "100%" } }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default ImageContainer;
