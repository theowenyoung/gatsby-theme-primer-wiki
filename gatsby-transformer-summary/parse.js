const markdownParser = require('@honkit/markdown')
// import modifiers from '../modifiers'
// const SummaryModifier = modifiers.Summary

/**
 Parse summary in a book, the summary can only be parsed
 if the readme as be detected before.

 @param {Book} book
 @return {Promise<Book>}
 */

function parseSummary(content) {
  const summarParsed = markdownParser.summary(content)
  return {
    groups: summarParsed.parts.map(item => {
      return {
        title: item.title,
        items: item.articles.map(formatItem),
      }
    }),
  }
}
function formatItem(item) {
  return {
    title: item.title,
    ref: item.ref,
    items: item.articles
      ? item.articles.map(item => {
          return formatItem(item)
        })
      : [],
  }
}

module.exports = parseSummary
