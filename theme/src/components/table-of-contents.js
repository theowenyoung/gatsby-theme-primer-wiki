import { Box, Link } from "@primer/components";
import React from "react";
import { useScrollSpy } from "../hooks/use-scrollspy";

function TableOfContents({ items, depth }) {
  const activeId = useScrollSpy(
    items.map(({ url }) => `[id="${url.slice(1)}"]`),
    {
      rootMargin: "0% 0% -24% 0%",
    }
  );
  return (
    <Box as="ul" m={0} p={0} css={{ listStyle: "none" }}>
      {items.map((item) => (
        <Box as="li" key={item.url} pl={depth > 0 ? 3 : 0}>
          {item.title ? (
            <Link
              display="inline-block"
              py={1}
              href={item.url}
              fontSize={[2, null, 1]}
              color="auto.gray.6"
              sx={{
                fontWeight: item.url === `#${activeId}` ? "bold" : "medium",
              }}
              aria-current={
                item.url === `#${activeId}` ? "location" : undefined
              }
            >
              {item.title}
            </Link>
          ) : null}
          {item.items ? (
            <TableOfContents items={item.items} depth={depth + 1} />
          ) : null}
        </Box>
      ))}
    </Box>
  );
}

TableOfContents.defaultProps = {
  depth: 0,
};

export default TableOfContents;
