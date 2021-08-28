import { graphql, useStaticQuery } from "gatsby";
import React from "react";
// eslint-disable-next-line import/no-webpack-loader-syntax
import SearchWorker from "worker-loader!./search.worker.js";
import kebabCase from "lodash/kebabCase";
function useSearch(query) {
  const latestQuery = React.useRef(query);
  const workerRef = React.useRef();

  const data = useStaticQuery(graphql`
    {
      tagsGroup: allMdx {
        group(field: frontmatter___tags) {
          fieldValue
        }
      }
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
    return data.tagsGroup.group
      .map((item) => {
        return {
          path: `/tags/${kebabCase(item.fieldValue)}`,
          title: `#${item.fieldValue}`,
        };
      })
      .concat(
        data.allMdx.nodes
          .filter((node) => {
            return node.frontmatter.draft !== true;
          })
          .map((node) => {
            return {
              path: node.fields.slug,
              title: node.fields.title,
              rawBody: node.rawBody,
            };
          })
      );
  }, [data]);

  const [results, setResults] = React.useState(list);

  const handleSearchResults = React.useCallback(({ data }) => {
    if (data.query && data.results && data.query === latestQuery.current) {
      setResults(data.results.map((item) => item.item));
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
