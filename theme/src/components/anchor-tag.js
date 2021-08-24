import React from "react";
import { withPrefix, Link as GatsbyLink } from "gatsby";
import Tippy from "@tippyjs/react";
import { MDXProvider } from "@mdx-js/react";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { Link, Box, Heading, Button } from "@primer/components";
import isRelativeUrl from "is-relative-url";
import { ZapIcon } from "@primer/octicons-react";

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
    (x) =>
      withPrefix(x.fields.slug) === withPrefix(href) || x.fields.title === title
  );
  let instance = null;
  const onCreate = (theInstance) => {
    instance = theInstance;
  };
  let popupContent;
  let child;
  const show = () => {
    if (instance) {
      instance.show();
    }
  };

  if (ref) {
    const nestedComponents = {
      a(props) {
        return <AnchorTag {...props} references={references} withoutPopup />;
      },
    };
    const frontmatterTitle = ref.frontmatter.title;
    popupContent = (
      <Box
        width={["100%", "400px"]}
        maxHeight="300px"
        minHeight="100px"
        overflowY="scroll"
        px="2"
        py="1"
      >
        {frontmatterTitle && (
          <Box mb={4}>
            <Box display="flex" sx={{ alignItems: "center" }}>
              <Heading as="h1" mr={2}>
                {frontmatterTitle}
              </Heading>
            </Box>
          </Box>
        )}
        <MDXProvider components={nestedComponents}>
          <MDXRenderer>{ref.body}</MDXRenderer>
        </MDXProvider>
      </Box>
    );
    child = (
      <Box
        display="inline"
        sx={{
          ":before": {
            content: "'[['",
            opacity: "0.5",
          },
          ":after": {
            content: "']]'",
            opacity: "0.5",
          },
          ":hover": {
            textDecoration: "none",
          },
        }}
      >
        <Link
          sx={{
            ":hover": {
              textDecoration: "none",
            },
          }}
          as={GatsbyLink}
          to={withPrefix(href)}
          title={title}
        >
          {title || restProps.children}
        </Link>
        <Button
          display={["inline-block", "inline-block", "inline-block", "none"]}
          bg="transparent"
          px="1"
          py="0"
          pb="1"
          ml="2"
          mr="1"
          onClick={show}
        >
          <ZapIcon size="14"></ZapIcon>
        </Button>
      </Box>
    );
  } else {
    popupContent = <div className="popover no-max-width">{href}</div>;
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    const externalLink = !isRelativeUrl(href);
    child = (
      <Link
        {...restProps}
        target={externalLink ? "_blank" : null}
        // Add noopener and noreferrer for security reasons
        rel={externalLink ? "noopener noreferrer" : null}
        href={
          !href || (href.indexOf && href.indexOf("#") === 0)
            ? href
            : withPrefix(href)
        }
        title={title}
      >
        {title || restProps.children}
      </Link>
    );
    return child;
  }

  if (withoutPopup) {
    return child;
  }

  return (
    <Tippy
      theme="light"
      delay={100}
      interactiveDebounce={0}
      interactive={true}
      animation="shift-away"
      content={popupContent}
      maxWidth="none"
      arrow={false}
      placement="bottom"
      touch={["hold", 5000]}
      onCreate={onCreate}
    >
      {child}
    </Tippy>
  );
};
export default AnchorTag;
