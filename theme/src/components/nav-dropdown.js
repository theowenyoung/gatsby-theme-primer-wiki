import { Box, StyledOcticon, Text, themeGet } from "@primer/components";
import { TriangleDownIcon } from "@primer/octicons-react";
import React from "react";
import styled from "styled-components";
import Details from "./details";

function NavDropdown({ title, children }) {
  return (
    <Details overlay={true}>
      {({ toggle }) => (
        <>
          <summary style={{ cursor: "pointer" }} onClick={toggle}>
            <Text>{title}</Text>
            <StyledOcticon icon={TriangleDownIcon} ml={1} />
          </summary>
          <Box position="absolute">
            <Box
              borderWidth="1px"
              borderStyle="solid"
              borderRadius={2}
              bg="auto.gray.8"
              py={1}
              mt={2}
              boxShadow="medium"
              borderColor="auto.gray.7"
              color="auto.white"
            >
              {children}
            </Box>
          </Box>
        </>
      )}
    </Details>
  );
}

export const NavDropdownItem = styled.a`
  display: block;
  padding: ${themeGet("space.2")} ${themeGet("space.3")};
  color: inherit;
  text-decoration: none;

  &:hover {
    color: ${themeGet("colors.auto.white")};
    background-color: ${themeGet("colors.auto.blue.5")};
    text-decoration: none;
  }
`;

export default NavDropdown;
