import { Box } from "@primer/components";
import React from "react";
import Header from "./header";
import Sidebar from "./sidebar";
import "../styles/global.css";
function Layout({ children, location, pageContext }) {
  const sidebarItems = pageContext.sidebarItems;
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header location={location} sidebarItems={sidebarItems} />
      <Box
        display="flex"
        flex="1 1 auto"
        flexDirection="row"
        css={{ zIndex: 0 }}
      >
        <Sidebar location={location} sidebarItems={sidebarItems} />
        <Box as="main">{children}</Box>
      </Box>
    </Box>
  );
}

export default Layout;
