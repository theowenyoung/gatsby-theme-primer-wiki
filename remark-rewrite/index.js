var visit = require("unist-util-visit");
const anymatch = require("anymatch");
const transformerUrl = require("@theowenyoung/transformer-markdown-url");
const relativeToSlug = require("@theowenyoung/gatsby-relative-path-to-slug");
const slugify = require("slugify");
const pathLib = require("path");
function rxWikiLink() {
  const pattern = "\\[\\[([^\\]]+)\\]\\]"; // [[wiki-link-regex]]
  return new RegExp(pattern, "ig");
}
const regexp = rxWikiLink();
module.exports = function remarkRewrite(pluginOptions) {
  const defaults = {
    extensions: [".md", ".mdx", ".markdown"],
    imageExtensions: [`.png`, `.jpg`, `.jpeg`, `.bmp`, `.tiff`, ".svg", ".gif"],
    fileIgnore: [],
    rewriteToParentUrlFileIgnore: [],
    pathIgnore: [],
  };
  const {
    fileIgnore,
    extensions,
    rewriteToParentUrlFileIgnore,
    pathIgnore,
    relativePath,
    imageExtensions,
    files,
  } = Object.assign(defaults, pluginOptions);

  const isIgnore = anymatch(fileIgnore, relativePath);
  let currentSlug = relativeToSlug(relativePath);
  let shouldRewrite = !isIgnore && currentSlug;
  if (!shouldRewrite) {
    return;
  }
  const shouldRewriteToParent = !anymatch(
    rewriteToParentUrlFileIgnore,
    relativePath
  );
  function transformer(markdownAST) {
    const visitor = (node, index, parent) => {
      const newUrl = transformerUrl(node.url, {
        fileUrl: currentSlug,
        extensions,
        addParent: shouldRewriteToParent,
        pathIgnore,
      });

      const isReplaced = newUrl !== node.url;

      node.url = newUrl;

      if (isReplaced) {
        const siblings = parent.children;
        if (!siblings || !Array.isArray(siblings)) {
          return;
        }
        const previous = siblings[index - 1];
        const next = siblings[index + 1];

        if (!(previous && next)) {
          return;
        }

        const previousValue = previous.value;
        const nextValue = next.value;

        if (
          previous.type !== "text" ||
          previous.value[previousValue.length - 1] !== "[" ||
          next.type !== "text" ||
          next.value[0] !== "]"
        ) {
          return;
        }

        previous.value = previousValue.replace(/\[$/, "");
        next.value = nextValue.replace(/^\]/, "");
      }
    };
    visit(markdownAST, "link", visitor);

    visit(markdownAST, "definition", (node) => {
      node.url = transformerUrl(node.url, {
        fileUrl: currentSlug,
        extensions,
        addParent: shouldRewriteToParent,
        pathIgnore,
      });
      // console.log('node final', node.url)
    });

    // handle not handled by remark-inline-links
    visit(markdownAST, "linkReference", (node, index, parent) => {
      const siblings = parent.children;
      const previous = siblings[index - 1];
      const next = siblings[index + 1];

      if (!(previous && previous.value && next && next.value)) {
        return;
      }
      const previousValue = previous.value.trimEnd();
      const nextValue = next.value.trimStart();

      if (!(previousValue.endsWith("[") && nextValue.startsWith("]"))) {
        return;
      }

      // try to get link,

      let heading = "";

      let parsedTitle = node.label;
      let _ = "";
      if (node.label.match(/#/)) {
        [_, heading] = node.label.split("#");
        [heading] = heading.split("|");
        parsedTitle = node.label.replace(`#${heading}`, "");
      }

      if (node.label.match(/\|/)) {
        [parsedTitle, _] = node.label.split("|");
      }

      const titleLowerCase = parsedTitle.toLowerCase();

      const isImage =
        previousValue.endsWith("![") &&
        imageExtensions.includes(pathLib.extname(titleLowerCase));

      let file = files
        .filter((mdFile) => extensions.includes(mdFile.ext))
        .find(
          (mdFile) =>
            mdFile.name === parsedTitle ||
            mdFile.name.toLowerCase() === titleLowerCase
        );

      if (isImage) {
        file = files.find(
          (mdFile) =>
            mdFile.base === parsedTitle ||
            mdFile.base.toLowerCase() === titleLowerCase
        );
      }

      if (file) {
        let slug = relativeToSlug(file.relativePath, {
          basePath: relativePath,
          extensions,
        });
        if (isImage) {
          slug = relativeToSlug(file.relativePath, {
            basePath: relativePath,
            removeExtension: false,
            extensions,
          });
        }
        if (isImage) {
          previous.value = previousValue.slice(0, previousValue.length - 2);
        } else {
          previous.value = previousValue.slice(0, previousValue.length - 1);
        }

        next.value = nextValue.slice(1);
        node.type = isImage ? "image" : "link";
        let nodeTitle = node.label;
        if (node.label.match(/#/)) {
          [node.children[0].value, heading] = node.label.split("#");
          [heading] = heading.split("|");
          node.label = node.label.replace(`#${heading}`, "");
          nodeTitle = node.children[0].value;
        }

        if (node.label.match(/\|/)) {
          [node.label, node.children[0].value] = node.label.split("|");
          nodeTitle = node.children[0].value;
        }

        node.url = `${slug}${
          heading && `#${slugify(heading, { lower: true })}`
        }`;
        node.title = nodeTitle;
        delete node.label;
        delete node.referenceType;
        delete node.identifier;

        // console.log("changed node", node);
      }
    });
    visit(markdownAST, "text", (node, index, parent) => {
      if (
        node.type === "text" &&
        parent.type === "paragraph" &&
        node.value.includes("[[") &&
        node.value.includes("]]")
      ) {
        // console.log("node.p", parent.type, node.value);

        // return;
        let match;
        let nodes = [];
        let isChanged = false;
        let currentIndex = 0;
        while ((match = regexp.exec(node.value)) !== null) {
          if (match.index - currentIndex > 0) {
            nodes.push({
              type: "text",
              value: node.value.slice(currentIndex, match.index),
            });
          }
          currentIndex = match.index + 2;

          let originalTitle = node.value.slice(
            currentIndex,
            regexp.lastIndex - 2
          );
          let heading = "";
          let _ = "";
          let parsedTitle = originalTitle;
          if (originalTitle.match(/#/)) {
            [_, heading] = originalTitle.split("#");
            [heading] = heading.split("|");
            parsedTitle = originalTitle.replace(`#${heading}`, "");
          }

          if (originalTitle.match(/\|/)) {
            [parsedTitle, _] = originalTitle.split("|");
          }

          const titleLowerCase = parsedTitle.toLowerCase();
          const isImage =
            node.value.charAt(match.index - 1) === "!" &&
            imageExtensions.includes(pathLib.extname(titleLowerCase));
          let file = files
            .filter((mdFile) => extensions.includes(mdFile.ext))
            .find(
              (mdFile) =>
                mdFile.name === parsedTitle ||
                mdFile.name.toLowerCase() === titleLowerCase
            );
          if (isImage) {
            file = files.find(
              (mdFile) =>
                mdFile.base === parsedTitle ||
                mdFile.base.toLowerCase() === titleLowerCase
            );
          }
          if (file) {
            isChanged = true;

            let childText = originalTitle;
            if (originalTitle.match(/#/)) {
              [childText, heading] = originalTitle.split("#");
              [heading] = heading.split("|");
            }

            if (originalTitle.match(/\|/)) {
              [_, childText] = originalTitle.split("|");
            }
            const slug = relativeToSlug(file.relativePath, {
              basePath: relativePath,
              extensions,
            });
            node.url = `${slug}${
              heading && `#${slugify(heading, { lower: true })}`
            }`;
            if (isImage) {
              node.url = relativeToSlug(file.relativePath, {
                basePath: relativePath,
                removeExtension: false,
                extensions,
              });
            }
            const linkedNode = {
              type: isImage ? "image" : "link",
              url: node.url,
              alt: isImage ? childText : undefined,
              children: isImage
                ? []
                : [
                    {
                      type: "text",
                      value: childText,
                    },
                  ],
            };

            nodes.push(linkedNode);
          } else {
            nodes.push({
              type: "text",
              value: `[[${parsedTitle}]]`,
            });
          }
          currentIndex = regexp.lastIndex;
        }
        if (currentIndex > 0 && node.value.length - 1 > currentIndex) {
          nodes.push({
            type: "text",
            value: node.value.slice(currentIndex, node.value.length - 1),
          });
        }
        if (isChanged) {
          nodes.forEach((newNode, newIndex) => {
            parent.children[index + newIndex] = newNode;
          });
          if (nodes.length > 0) {
            return [visit.SKIP, index + nodes.length];
          }
        }
      }
    });
  }
  return transformer;
};
