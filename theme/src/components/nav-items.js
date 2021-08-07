import {StyledOcticon, Link, themeGet, Box, Heading} from '@primer/components'
import {LinkExternalIcon} from '@primer/octicons-react'
import {Link as GatsbyLink} from 'gatsby'
import React from 'react'
import styled from 'styled-components'

const NavLink = styled(Link)`
  &.active {
    font-weight: ${themeGet('fontWeights.bold')};
    color: ${themeGet('colors.auto.gray.8')};
  }
`
function SidebarItem({title, url, external, items, depth = 0}) {
  return (
    <Box display="flex" flexDirection="column" ml={depth > 0 ? 3 : 0}>
      {external ? (
        <Link display="block" mt={2} fontSize={1} href={url}>
          <Box display="flex" alignItems="center" position="relative">
            {title}
            <StyledOcticon
              ml={2}
              sx={{
                top: '2px',
                position: 'relative',
              }}
              size={14}
              icon={LinkExternalIcon}
              color="text.placeholder"
            />
          </Box>
        </Link>
      ) : (
        <NavLink
          key={title}
          as={GatsbyLink}
          to={url}
          activeClassName="active"
          display="block"
          mt={2}
          fontSize={1}
          partiallyActive={true}
        >
          {title}
        </NavLink>
      )}

      {Array.isArray(items)
        ? items.map(subItem => (
            <SidebarItem key={subItem.title} depth={depth + 1} {...subItem} />
          ))
        : null}
    </Box>
  )
}

function NavItems({items}) {
  return (
    <>
      {items.map(item => (
        <Box
          borderStyle="solid"
          borderColor="border.primary"
          key={item.title}
          borderWidth={0}
          borderRadius={0}
          borderTopWidth={1}
          p={4}
        >
          <Box display="flex" flexDirection="column">
            {item.title && (
              <Heading
                color="text.placeholder"
                fontSize="12px"
                sx={{
                  textTransform: 'uppercase',
                  fontFamily: 'Content-font, Roboto, sans-serif;',
                }}
                mb={1}
                fontWeight="500"
              >
                {item.title}
              </Heading>
            )}
            {Array.isArray(item.items)
              ? item.items.map(child => (
                  <SidebarItem key={child.title} {...child}></SidebarItem>
                ))
              : null}
          </Box>
        </Box>
      ))}
    </>
  )
}

export default NavItems
