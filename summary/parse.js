const markdownParser = require("@honkit/markdown");
const remark = require("remark");
const remarkInlineLinks = require("remark-inline-links");
const replaceLinkTitle = require("./replace-link-title");
/**
 Parse summary in a book, the summary can only be parsed
 if the readme as be detected before.

 @param {Book} book
 @return {Promise<Book>}
 */

async function parseSummary(content) {
  return remark()
    .use(remarkInlineLinks)
    .use(replaceLinkTitle)
    .process(content)
    .then((file) => {
      // console.log(String(file))
      const summarParsed = markdownParser.summary(String(file));
      return {
        groups: summarParsed.parts.map((item) => {
          return {
            title: item.title,
            items: item.articles.map(formatItem),
          };
        }),
      };
    });
}
function formatItem(item) {
  return {
    title: item.title,
    ref: item.ref,
    items: item.articles
      ? item.articles.map((item) => {
          return formatItem(item);
        })
      : [],
  };
}

module.exports = parseSummary;
