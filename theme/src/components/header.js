import { Box, Link, StyledOcticon } from "@primer/components";
import {
  MarkGithubIcon,
  SearchIcon,
  ThreeBarsIcon,
} from "@primer/octicons-react";
import { Link as GatsbyLink } from "gatsby";
import React from "react";
import { ThemeContext } from "styled-components";
import useSiteMetadata from "../use-site";
import DarkButton from "./dark-button";
import MobileSearch from "./mobile-search";
import NavDrawer, { useNavDrawerState } from "./nav-drawer";
import NavDropdown, { NavDropdownItem } from "./nav-dropdown";
import Search from "./search";
import GraphButton from "./graph-button";
import useThemeConfig from "../use-theme-config";
export const HEADER_HEIGHT = 66;
function Header({ isSearchEnabled, location, sidebarItems, tagsGroups }) {
  const theme = React.useContext(ThemeContext);
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useNavDrawerState(
    theme.breakpoints[2]
  );
  const [isGraphOpen, setIsGraphOpen] = React.useState(false);

  const [isMobileSearchOpen, setIsMobileSearchOpen] = React.useState(false);
  const { siteMetadata } = useSiteMetadata();
  const themeConfig = useThemeConfig();
  const primerNavItems = themeConfig.nav;

  return (
    <Box top={0} zIndex={1} position="sticky">
      <Box
        display="flex"
        height={HEADER_HEIGHT}
        px={[3, null, null, 4]}
        alignItems="center"
        justifyContent="space-between"
        bg="auto.black"
      >
        <Box display="flex" alignItems="center">
          <Link href="/" color="auto.white" mr={3} lineHeight="condensedUltra">
            <StyledOcticon icon={MarkGithubIcon} size="medium" />
          </Link>

          {siteMetadata.shortName ? (
            <>
              <Link as={GatsbyLink} to="/" color="auto.white" fontFamily="mono">
                {siteMetadata.shortName}
              </Link>
            </>
          ) : null}

          {isSearchEnabled ? (
            <Box display={["none", null, null, "block"]} ml={4}>
              <Search />
            </Box>
          ) : null}
        </Box>
        <Box display="flex">
          <Box display={["none", null, null, "flex"]} alignItems="center">
            <PrimerNavItems items={primerNavItems} />
            <DarkButton
              aria-label="Show Graph Visualisation"
              onClick={setIsGraphOpen.bind(null, !isGraphOpen)}
              sx={{ ml: "3" }}
            >
              <GraphButton
                isOpen={isGraphOpen}
                setIsOpen={setIsGraphOpen}
                tagsGroups={tagsGroups}
              ></GraphButton>
            </DarkButton>
          </Box>

          <Box display={["flex", null, null, "none"]}>
            {isSearchEnabled ? (
              <>
                <DarkButton
                  aria-label="Search"
                  aria-expanded={isMobileSearchOpen}
                  onClick={() => setIsMobileSearchOpen(true)}
                >
                  <SearchIcon />
                </DarkButton>
                <MobileSearch
                  isOpen={isMobileSearchOpen}
                  onDismiss={() => setIsMobileSearchOpen(false)}
                />
              </>
            ) : null}
            <DarkButton
              aria-label="Show Graph Visualisation"
              onClick={setIsGraphOpen.bind(null, !isGraphOpen)}
              sx={{ ml: "3" }}
            >
              <GraphButton
                isOpen={isGraphOpen}
                setIsOpen={setIsGraphOpen}
                tagsGroups={tagsGroups}
              ></GraphButton>
            </DarkButton>
            <DarkButton
              aria-label="Menu"
              aria-expanded={isNavDrawerOpen}
              onClick={() => setIsNavDrawerOpen(true)}
              ml={3}
            >
              <ThreeBarsIcon />
            </DarkButton>
            <NavDrawer
              location={location}
              isOpen={isNavDrawerOpen}
              onDismiss={() => setIsNavDrawerOpen(false)}
              sidebarItems={sidebarItems}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

Header.defaultProps = {
  isSearchEnabled: true,
};

function PrimerNavItems({ items }) {
  return (
    <Box display="flex" alignItems="center" color="auto.blue.2">
      {items.map((item, index) => {
        if (item.items) {
          return (
            <Box ml={4} key={index}>
              <NavDropdown title={item.title}>
                {item.items.map((child) => (
                  <NavDropdownItem key={child.title} href={child.url}>
                    {child.title}
                  </NavDropdownItem>
                ))}
              </NavDropdown>
            </Box>
          );
        }

        return (
          <Link
            key={index}
            href={item.url}
            display="block"
            color="inherit"
            ml={4}
          >
            {item.title}
          </Link>
        );
      })}
    </Box>
  );
}

export default Header;
