import React from "react";
import { Box, Heading, StyledOcticon, Text } from "@primer/components";
import { HashIcon } from "@primer/octicons-react";
import components from "./mdx-components";
import kebabCase from "lodash/kebabCase";
import TagPosts from "./tag-posts";
const TagsBlock = ({ tags, nodes }) => {
  if (!tags.length) {
    return null;
  }

  return (
    <Box bg="auto.gray.1" borderRadius="2" px="3" py="4" mt="4">
      <Heading as="h4" fontSize="2" mb="3" color="text.placeholder">
        <StyledOcticon
          mr={1}
          size={16}
          sx={{
            top: "-3px",
            position: "relative",
          }}
          icon={HashIcon}
          color="text.placeholder"
        />
        Tags
      </Heading>
      <Box>
        {tags.map((tag) => {
          const references = [
            {
              fields: {
                slug: `/tags/${kebabCase(tag)}/`,
              },
              component: (
                <TagPosts
                  nodes={nodes.filter((node) => {
                    return node.frontmatter.tags.includes(tag);
                  })}
                  tag={tag}
                ></TagPosts>
              ),
            },
          ];

          return (
            <components.a
              key={tag}
              href={`/tags/${kebabCase(tag)}/`}
              references={references}
              mr={3}
            >
              #{tag}
            </components.a>
          );
        })}
      </Box>
    </Box>
  );
};

export default TagsBlock;
