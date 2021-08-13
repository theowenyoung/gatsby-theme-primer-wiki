import React from 'react'
import {withPrefix, Link as GatsbyLink} from 'gatsby'
import Tippy from '@tippyjs/react'
import {MDXProvider} from '@mdx-js/react'
import {MDXRenderer} from 'gatsby-plugin-mdx'
import {Link, Box} from '@primer/components'
// import './anchor-tag.css'
const AnchorTag = ({
  title,
  href,
  references = [],
  withoutLink,
  withoutPopup,
  ...restProps
}) => {
  // same as in gatsby-transformer-markdown-references/src/compute-inbounds.ts#getRef
  const ref = references.find(
    x =>
      withPrefix(x.fields.slug) === withPrefix(href) ||
      x.fields.title === title,
  )

  let popupContent
  let child

  if (ref) {
    const nestedComponents = {
      a(props) {
        return <AnchorTag {...props} references={references} withoutPopup />
      },
    }

    popupContent = (
      <Box
        width="400px"
        maxHeight="300px"
        minHeight="100px"
        overflowY="scroll"
        px="2"
        py="1"
      >
        <MDXProvider components={nestedComponents}>
          <MDXRenderer>{ref.body}</MDXRenderer>
        </MDXProvider>
      </Box>
    )
    child = (
      <Link
        sx={{
          ':before': {
            content: "'[['",
            opacity: '0.5',
          },
          ':after': {
            content: "']]'",
            opacity: '0.5',
          },
          ':hover': {
            textDecoration: 'none',
          },
        }}
        as={GatsbyLink}
        to={withPrefix(href)}
        title={title}
      >
        {title || restProps.children}
      </Link>
    )
  } else {
    popupContent = <div className="popover no-max-width">{href}</div>
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    const externalLink = /^(http(s?)):\/\//i.test(href)
    child = (
      <Link
        {...restProps}
        target={externalLink ? '_blank' : null}
        // Add noopener and noreferrer for security reasons
        rel={externalLink ? 'noopener noreferrer' : null}
        href={
          !href || (href.indexOf && href.indexOf('#') === 0)
            ? href
            : withPrefix(href)
        }
        title={title}
      >
        {restProps.children}
      </Link>
    )
    return child
  }

  if (withoutPopup) {
    return child
  }

  return (
    <Tippy
      theme="light"
      interactive={true}
      animation="shift-away"
      content={popupContent}
      maxWidth="none"
    >
      {child}
    </Tippy>
  )
}
export default AnchorTag
