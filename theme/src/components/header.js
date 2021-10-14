import { Box, Link, StyledOcticon } from "@primer/components";
import {
  MarkGithubIcon,
  SearchIcon,
  ThreeBarsIcon,
  SunIcon,
  MoonIcon,
} from "@primer/octicons-react";
import { Link as GatsbyLink } from "gatsby";
import React from "react";
import useSiteMetadata from "../use-site";
import DarkButton from "./dark-button";
import MobileSearch from "./mobile-search";
import NavDrawer, { useNavDrawerState } from "./nav-drawer";
import NavDropdown, { NavDropdownItem } from "./nav-dropdown";
import Search from "./search";
import GraphButton from "./graph-button";
import useThemeConfig from "../use-theme-config";
import { useTheme } from "@primer/components";
import components from "./mdx-components";
import { GatsbyImage, getImage } from "gatsby-plugin-image";

export const HEADER_HEIGHT = 66;
function Header({
  isSearchEnabled,
  location,
  sidebarItems,
  tagsGroups,
  currentSlug,
}) {
  const { resolvedColorMode, setColorMode, theme } = useTheme();
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useNavDrawerState(
    theme.breakpoints[2]
  );
  const [isGraphOpen, setIsGraphOpen] = React.useState(false);

  const [isMobileSearchOpen, setIsMobileSearchOpen] = React.useState(false);
  const { siteMetadata } = useSiteMetadata();
  const themeConfig = useThemeConfig();
  const primerNavItems = themeConfig.nav;
  const image = getImage(themeConfig.icon);
  return (
    <Box top={0} zIndex={1} position="sticky">
      <Box
        display="flex"
        height={HEADER_HEIGHT}
        px={[3, null, null, 4]}
        alignItems="center"
        justifyContent="space-between"
        bg="header.bg"
        color="header.text"
      >
        <Box display="flex" alignItems="center">
          <Link as={GatsbyLink} to="/" color="header.logo" mr={3}>
            {themeConfig.icon ? (
              <GatsbyImage
                imgStyle={{
                  borderRadius: "9999999px",
                }}
                image={image}
                alt="logo"
              />
            ) : (
              <StyledOcticon icon={MarkGithubIcon} size="medium" />
            )}
          </Link>

          {siteMetadata.shortName ? (
            <>
              <Link
                as={GatsbyLink}
                to="/"
                color="header.logo"
                fontFamily="mono"
              >
                {siteMetadata.shortName}
              </Link>
            </>
          ) : null}

          {isSearchEnabled ? (
            <Box display={["none", null, null, "block"]} ml={4}>
              <Search tagsGroups={tagsGroups} />
            </Box>
          ) : null}
        </Box>
        <Box display="flex">
          <Box display={["none", null, null, "flex"]} alignItems="center">
            <PrimerNavItems items={primerNavItems} />

            <DarkButton
              aria-label="Theme"
              aria-expanded={isNavDrawerOpen}
              onClick={() =>
                setColorMode(resolvedColorMode === "day" ? "night" : "day")
              }
              ml={3}
            >
              {resolvedColorMode === "day" ? (
                <SunIcon />
              ) : (
                <MoonIcon></MoonIcon>
              )}
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
                  tagsGroups={tagsGroups}
                  isOpen={isMobileSearchOpen}
                  onDismiss={() => setIsMobileSearchOpen(false)}
                />
              </>
            ) : null}
          </Box>
          <DarkButton aria-label="Show Graph Visualisation" sx={{ ml: "3" }}>
            <GraphButton
              currentSlug={currentSlug}
              isOpen={isGraphOpen}
              setIsOpen={setIsGraphOpen}
              tagsGroups={tagsGroups}
            ></GraphButton>
          </DarkButton>

          <Box display={["flex", null, null, "none"]}>
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
    <Box display="flex" alignItems="center" color="header.text">
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
          <components.a
            key={index}
            href={item.url}
            display="block"
            color="inherit"
            ml={4}
          >
            {item.title}
          </components.a>
        );
      })}
    </Box>
  );
}

export default Header;
