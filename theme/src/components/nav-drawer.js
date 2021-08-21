import { Box, Link, Text } from "@primer/components";
import { ChevronDownIcon, ChevronUpIcon, XIcon } from "@primer/octicons-react";
import { Link as GatsbyLink } from "gatsby";
import debounce from "lodash.debounce";
import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import primerNavItems from "../primer-nav.yml";
import useSiteMetadata from "../use-site";
import DarkButton from "./dark-button";
import Details from "./details";
import Drawer from "./drawer";
import NavItems from "./nav-items";

export function useNavDrawerState(breakpoint) {
  // Handle string values from themes with units at the end
  if (typeof breakpoint === "string") {
    breakpoint = parseInt(breakpoint, 10);
  }
  const [isOpen, setOpen] = React.useState(false);

  const onResize = React.useCallback(() => {
    if (window.innerWidth >= breakpoint) {
      setOpen(false);
    }
  }, [setOpen, breakpoint]);

  const debouncedOnResize = React.useMemo(() => {
    return debounce(onResize, 250);
  }, [onResize]);

  React.useEffect(() => {
    if (isOpen) {
      window.addEventListener("resize", debouncedOnResize);
      return () => {
        // cancel any debounced invocation of the resize handler
        debouncedOnResize.cancel();
        window.removeEventListener("resize", debouncedOnResize);
      };
    }
  }, [isOpen, debouncedOnResize]);

  return [isOpen, setOpen];
}

function NavDrawer({ isOpen, onDismiss, location }) {
  const { siteMetadata } = useSiteMetadata();
  const data = useStaticQuery(graphql`
    {
      allSummaryGroup {
        nodes {
          title
          items {
            title
            url
            external
            items {
              title
              url
              external
              items {
                title
                url
                external
                items {
                  title
                  url
                  external
                }
              }
            }
          }
        }
      }
    }
  `);

  const navItems = data.allSummaryGroup.nodes;
  return (
    <Drawer isOpen={isOpen} onDismiss={onDismiss}>
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        bg="auto.gray.9"
        style={{ overflow: "auto", WebkitOverflowScrolling: "touch" }}
      >
        <Box
          display="flex"
          flexDirection="column"
          flex="0 0 auto"
          color="auto.blue.2"
          bg="auto.gray.9"
        >
          <Box
            borderStyle="solid"
            borderWidth={0}
            borderRadius={0}
            borderBottomWidth={1}
            borderColor="auto.gray.7"
          >
            <Box
              display="flex"
              py={3}
              pl={4}
              pr={3}
              alignItems="center"
              justifyContent="space-between"
            >
              <Link
                href="https://primer.style"
                fontFamily="mono"
                color="inherit"
              >
                Primer
              </Link>
              <DarkButton aria-label="Close" onClick={onDismiss}>
                <XIcon />
              </DarkButton>
            </Box>
          </Box>
          <Box display="flex" flexDirection="column">
            <PrimerNavItems items={primerNavItems} />
          </Box>
        </Box>
        {navItems.length > 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            flex="1 0 auto"
            color="auto.gray.7"
            bg="auto.gray.0"
          >
            <Link
              as={GatsbyLink}
              to="/"
              display="inline-block"
              color="inherit"
              fontFamily="mono"
              mx={4}
              my={4}
            >
              {siteMetadata.title}
            </Link>
            <NavItems location={location} items={navItems} />
          </Box>
        ) : null}
      </Box>
    </Drawer>
  );
}

function PrimerNavItems({ items }) {
  return items.map((item, index) => {
    return (
      <Box
        borderStyle="solid"
        key={item.title}
        borderWidth={0}
        borderRadius={0}
        borderTopWidth={index !== 0 ? 1 : 0}
        borderColor="auto.gray.7"
        p={4}
      >
        {item.children ? (
          <Details key={index}>
            {({ open, toggle }) => {
              return (
                <>
                  <summary onClick={toggle} style={{ cursor: "pointer" }}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Text>{item.title}</Text>
                      {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    </Box>
                  </summary>
                  <Box display="flex" flexDirection="column" mt={2}>
                    {item.children.map((child) => (
                      <Link
                        key={child.title}
                        href={child.url}
                        py={1}
                        mt={2}
                        fontSize={1}
                        color="inherit"
                      >
                        {child.title}
                      </Link>
                    ))}
                  </Box>
                </>
              );
            }}
          </Details>
        ) : (
          <Link key={index} href={item.url} color="inherit" display="block">
            {item.title}
          </Link>
        )}
      </Box>
    );
  });
}

export default NavDrawer;
