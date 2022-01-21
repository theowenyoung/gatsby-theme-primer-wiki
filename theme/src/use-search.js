import { graphql, useStaticQuery } from "gatsby";
import React from "react";
import useThemeConfig from "./use-theme-config";

// eslint-disable-next-line import/no-webpack-loader-syntax
import SearchWorker from "worker-loader!./search.worker.js";
function useSearch(query, tagsGroups) {
  const latestQuery = React.useRef(query);
  const workerRef = React.useRef();
  const themeConfig = useThemeConfig();

  const data = useStaticQuery(graphql`
    {
      allMdx {
        nodes {
          fields {
            slug
            title
          }
          frontmatter {
            draft
          }
          rawBody
        }
      }
    }
  `);

  const list = React.useMemo(() => {
    return tagsGroups
      .map((item) => {
        return {
          path: item.url,
          title: `#${item.title}`,
          // body: "Tag",
        };
      })
      .concat(
        data.allMdx.nodes
          .filter((node) => {
            return node.frontmatter.draft !== true;
          })
          .map((node) => {
            const item = {
              path: node.fields.slug,
              title: node.fields.title,
            };
            if (themeConfig.searchBody) {
              item.body = node.rawBody.slice(0, 500);
            }
            return item;
          })
      );
  }, [data, tagsGroups]);

  const [results, setResults] = React.useState(list);

  const handleSearchResults = React.useCallback(({ data }) => {
    if (data.query && data.results && data.query === latestQuery.current) {
      setResults([...data.results.map((item) => item.item)]);
    }
  }, []);

  React.useEffect(() => {
    const worker = new SearchWorker();
    worker.addEventListener("message", handleSearchResults);
    worker.postMessage({ list });
    workerRef.current = worker;

    return () => {
      workerRef.current.terminate();
    };
  }, [list, handleSearchResults]);

  React.useEffect(() => {
    latestQuery.current = query;
    if (query && workerRef.current) {
      workerRef.current.postMessage({ query: query });
    } else {
      setResults(list);
    }
  }, [query, list]);

  return results;
}

export default useSearch;
