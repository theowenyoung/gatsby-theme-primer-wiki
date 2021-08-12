const defaultOptions = pluginOptions => {
  const options = Object.assign(
    {
      extensions: [`.mdx`, '.md', '.markdown'],
      mdxOtherwiseConfigured: false,
    },
    pluginOptions,
  )
  return options
}
exports.defaultOptions = defaultOptions
function markdownHeadingToPlainText(text) {
  // Remove Markdown syntax (bold, italic, links etc.) in a heading
  // For example: `_italic_` -> `italic`
  return text.replace(/\[([^\]]*)\]\[[^\]]*\]/, (_, g1) => g1)
}

function rxMarkdownHeading(level) {
  const pattern = `^#{${level}}\\s+(.+)$`
  return new RegExp(pattern, 'im')
}

function findTopLevelHeading(md) {
  if (typeof md !== 'string') {
    return null
  }

  const regex = rxMarkdownHeading(1)
  const match = regex.exec(md)
  if (match) {
    return markdownHeadingToPlainText(match[1])
  }

  return null
}
async function getTitle(node, {loadNodeContent}) {
  if (
    typeof node.frontmatter === 'object' &&
    node.frontmatter &&
    'title' in node.frontmatter &&
    node.frontmatter['title']
  ) {
    return node.frontmatter['title']
  }
  const content = await loadNodeContent(node)
  return findTopLevelHeading(content) || ''
}
exports.getTitle = getTitle
