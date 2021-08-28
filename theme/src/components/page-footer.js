import { StyledOcticon, Link, Box } from "@primer/components";
import { PencilIcon } from "@primer/octicons-react";
import React from "react";
import LastUpdated from "./last-updated";
import useThemeConfig from "../use-theme-config";

function PageFooter({ editUrl, lastUpdated }) {
  const data = useThemeConfig();

  return editUrl || lastUpdated ? (
    <Box
      borderStyle="solid"
      borderColor="border.primary"
      borderWidth={0}
      borderTopWidth={1}
      borderRadius={0}
      mt={8}
      py={5}
    >
      <Box display="flex" flexWrap="wrap" justifyContent="space-between">
        {editUrl ? (
          <Link mb="1" href={editUrl}>
            <StyledOcticon icon={PencilIcon} mr={2} />
            {data.editUrlText}
          </Link>
        ) : null}
        {lastUpdated && <LastUpdated lastUpdated={lastUpdated}></LastUpdated>}
      </Box>
    </Box>
  ) : null;
}

PageFooter.defaultProps = {
  contributors: [],
};

export default PageFooter;
