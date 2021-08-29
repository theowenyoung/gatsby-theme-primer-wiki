import React from "react";
import components from "./mdx-components";
import { Box, Text } from "@primer/components";
import useThemeConfig from "../use-theme-config";

const TagPosts = ({
  tag,
  nodes,
  shouldShowInstantView = false,
  forceMobile = false,
}) => {
  const themeConfig = useThemeConfig();
  const posts = nodes.sort((a, b) => {
    const aDate = new Date(a.fields.lastUpdatedAt || 0).getTime();
    const bDate = new Date(b.fields.lastUpdatedAt || 0).getTime();
    return bDate - aDate;
  });
  const AnchorTag = (props) => (
    <components.a {...props} references={shouldShowInstantView ? posts : []} />
  );
  return (
    <Box>
      <components.h2># {tag}</components.h2>
      <Box>
        <components.ul>
          {posts &&
            posts.map((post) => {
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
    </Box>
  );
};
export default TagPosts;
