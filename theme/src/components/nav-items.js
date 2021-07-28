import {StyledOcticon, Link, themeGet, Box} from '@primer/components'
import {LinkExternalIcon} from '@primer/octicons-react'
import {Link as GatsbyLink} from 'gatsby'
import preval from 'preval.macro'
import React from 'react'
import styled from 'styled-components'

// This code needs to run at build-time so it can access the file system.
const repositoryUrl = preval`
  const readPkgUp = require('read-pkg-up')
  const getPkgRepo = require('get-pkg-repo')
  try {
    const repo = getPkgRepo(readPkgUp.sync().packageJson)
    module.exports = \`https://github.com/\${repo.user}/\${repo.project}\`
  } catch (error) {
    module.exports = ''
  }
`

const NavLink = styled(Link)`
  &.active {
    font-weight: ${themeGet('fontWeights.bold')};
    color: ${themeGet('colors.auto.gray.8')};
  }
`

function NavItems({items}) {
  return (
    <>
      {items.map(item => (
        <Box
          borderStyle="solid"
          borderColor="border.primary"
          key={item.text}
          borderWidth={0}
          borderRadius={0}
          borderTopWidth={1}
          p={4}
        >
          <Box display="flex" flexDirection="column">
            <NavLink
              as={GatsbyLink}
              to={item.link}
              activeClassName="active"
              partiallyActive={true}
              color="inherit"
            >
              {item.text}
            </NavLink>
            {item.items ? (
              <Box display="flex" flexDirection="column" mt={2}>
                {item.items.map(child => (
                  <NavLink
                    key={child.text}
                    as={GatsbyLink}
                    to={child.link}
                    activeClassName="active"
                    display="block"
                    py={1}
                    mt={2}
                    fontSize={1}
                  >
                    {child.text}
                  </NavLink>
                ))}
              </Box>
            ) : null}
          </Box>
        </Box>
      ))}
      {repositoryUrl ? (
        <Box
          borderStyle="solid"
          borderColor="border.primary"
          borderWidth={0}
          borderTopWidth={1}
          borderRadius={0}
          p={4}
        >
          <Link href={repositoryUrl} color="inherit">
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              GitHub
              <StyledOcticon icon={LinkExternalIcon} color="auto.gray.7" />
            </Box>
          </Link>
        </Box>
      ) : null}
    </>
  )
}

export default NavItems
