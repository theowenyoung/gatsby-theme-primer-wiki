import React from "react";
import components from "./mdx-components";
import { Box, Text } from "@primer/components";
import useThemeConfig from "../use-theme-config";

const TagPosts = ({
  nodes,
  shouldShowInstantView = false,
  forceMobile = false,
}) => {
  const themeConfig = useThemeConfig();
  const posts = nodes;
  const AnchorTag = (props) => (
    <components.a {...props} references={shouldShowInstantView ? posts : []} />
  );
  return (
    <Box>
      <components.ul>
        {posts &&
          posts
            .filter(
              (post) =>
                post.fields.slug !== "/404/" &&
                (!post.frontmatter || post.frontmatter.draft !== true)
            )
            .map((post) => {
              return (
                <li key={post.fields.slug}>
                  <AnchorTag href={post.fields.slug}>
                    {post.fields.title}
                  </AnchorTag>
                  {themeConfig.shouldShowLastUpdated &&
                    post.fields.lastUpdated &&
                    !forceMobile && (
                      <Text
                        display={["none", null, null, "inline-block"]}
                        color="text.placeholder"
                        fontSize={1}
                      >
                        &nbsp; - {themeConfig.lastUpdatedText}&nbsp;
                        {post.fields.lastUpdated}
                      </Text>
                    )}
                  {themeConfig.shouldShowLastUpdated &&
                    post.fields.lastUpdated && (
                      <Box
                        display={
                          forceMobile ? "block" : ["block", null, null, "none"]
                        }
                        color="text.placeholder"
                        fontSize={1}
                        mb={2}
                        mt={1}
                      >
                        {themeConfig.lastUpdatedText}&nbsp;
                        {post.fields.lastUpdated}
                      </Box>
                    )}
                </li>
              );
            })}
      </components.ul>
    </Box>
  );
};
export default TagPosts;
