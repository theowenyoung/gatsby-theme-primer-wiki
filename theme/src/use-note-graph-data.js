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
          inboundReferences {
            ... on Mdx {
              id
            }
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

  const { notesMap } = useMemo(() => {
    const notesMap = new Map();
    tagsGroups.forEach((tagGroup) => {
      if (tagGroup.items) {
        const note = {
          id: tagGroup.url,
          title: `#${tagGroup.title}`,
          url: tagGroup.url,
          linkTo: [],
          referencedBy: [],
        };
        tagGroup.items.forEach((node) => {
          note.linkTo.push(node.id);
        });

        notesMap.set(note.id, note);
      }
    });
    data.allMdx.nodes.forEach((node) => {
      if (!node.fields || !node.fields.slug) {
        return;
      }

      const note = {
        id: node.id,
        title: node.fields.title,
        url: node.fields.slug,
        linkTo: [],
        referencedBy: [],
      };

      node.inboundReferences.forEach((x) => {
        note.referencedBy && note.referencedBy.push(x.id);
      });

      node.outboundReferences.forEach((x) => {
        note.linkTo && note.linkTo.push(x.id);
      });
      notesMap.set(note.id, note);
    });

    return { notesMap };
  }, [data, tagsGroups]);

  return { notesMap };
};
