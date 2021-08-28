import { useMemo } from "react";
import { useStaticQuery, graphql } from "gatsby";

export const useGraphData = (tagsGroups) => {
  const data = useStaticQuery(graphql`
    {
      allMdx {
        nodes {
          id
          fields {
            title
            slug
          }
          outboundReferences {
            ... on Mdx {
              id
            }
          }
        }
      }
    }
  `);

  const [nodesData, linksData] = useMemo(() => {
    const nodesData = [];
    const linksData = [];
    const textColor =
      typeof document !== "undefined"
        ? getComputedStyle(document.body).getPropertyValue("--text").trim()
        : "#1a202c";
    tagsGroups.forEach((tagGroup) => {
      if (tagGroup.items) {
        // nodesData.push({
        //   id: tagGroup.url,
        //   label: `#${tagGroup.title}`,
        //   slug: tagGroup.url,
        //   color: textColor,
        // });
        // tagGroup.items.forEach((node) => {
        //   linksData.push({ source: tagGroup.url, target: node.id });
        // });
      }
    });
    data.allMdx.nodes.forEach((node) => {
      if (!node.fields || !node.fields.slug) {
        return;
      }

      nodesData.push({
        id: node.id,
        label: node.fields.title,
        slug: node.fields.slug,
        color: textColor,
      });

      node.outboundReferences.forEach((x) =>
        linksData.push({ source: node.id, target: x.id })
      );
    });

    return [nodesData, linksData];
  }, [data, tagsGroups]);

  return [nodesData, linksData];
};
