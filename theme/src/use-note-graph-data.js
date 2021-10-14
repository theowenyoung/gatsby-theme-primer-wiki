import { useMemo } from "react";
import { useStaticQuery, graphql } from "gatsby";

export const useGraphData = (tagsGroups) => {
  const data = useStaticQuery(graphql`
    {
      allMdx {
        nodes {
          fields {
            title
            slug
          }
          inboundReferences {
            ... on Mdx {
              fields {
                title
                slug
              }
            }
          }
          outboundReferences {
            ... on Mdx {
              fields {
                title
                slug
              }
            }
          }
        }
      }
    }
  `);

  const { notesMap } = useMemo(() => {
    const notesMap = new Map();
    // add latest page
    const latestNote = {
      id: "/latest/",
      title: `Latest`,
      url: "/latest/",
      linkTo: [],
      referencedBy: [],
    };
    notesMap.set(latestNote.id, latestNote);
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
          note.linkTo.push(node.url);
        });

        notesMap.set(note.id, note);
      }
    });
    data.allMdx.nodes.forEach((node) => {
      if (!node.fields || !node.fields.slug) {
        return;
      }

      const note = {
        id: node.fields.slug,
        title: node.fields.title,
        url: node.fields.slug,
        linkTo: [],
        referencedBy: [],
      };

      node.inboundReferences.forEach((x) => {
        note.referencedBy && note.referencedBy.push(x.fields.slug);
      });

      node.outboundReferences.forEach((x) => {
        note.linkTo && note.linkTo.push(x.fields.slug);
      });
      notesMap.set(note.id, note);
    });
    return { notesMap };
  }, [data, tagsGroups]);

  return { notesMap };
};
