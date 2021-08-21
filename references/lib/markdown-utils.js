exports.markdownHeadingToPlainText = markdownHeadingToPlainText;
exports.rxMarkdownHeading = rxMarkdownHeading;
exports.findTopLevelHeading = findTopLevelHeading;
exports.cleanupMarkdown = cleanupMarkdown;
exports.findInMarkdown = findInMarkdown;
exports.REGEX_FENCED_CODE_BLOCK = void 0;

/**
 * Adapted from vscode-markdown/src/util.ts
 * https://github.com/yzhang-gh/vscode-markdown/blob/master/src/util.ts
 */
const REGEX_FENCED_CODE_BLOCK =
  /^( {0,3}|\t)```[^`\r\n]*$[\w\W]+?^( {0,3}|\t)``` *$/gm;
exports.REGEX_FENCED_CODE_BLOCK = REGEX_FENCED_CODE_BLOCK;

function markdownHeadingToPlainText(text) {
  // Remove Markdown syntax (bold, italic, links etc.) in a heading
  // For example: `_italic_` -> `italic`
  return text.replace(/\[([^\]]*)\]\[[^\]]*\]/, (_, g1) => g1);
}

function rxMarkdownHeading(level) {
  const pattern = `^#{${level}}\\s+(.+)$`;
  return new RegExp(pattern, "im");
}

function findTopLevelHeading(md) {
  if (typeof md !== "string") {
    return null;
  }

  const regex = rxMarkdownHeading(1);
  const match = regex.exec(md);

  if (match) {
    return markdownHeadingToPlainText(match[1]);
  }

  return null;
}

function cleanupMarkdown(markdown) {
  const replacer = (foundStr) => foundStr.replace(/[^\r\n]/g, "");

  return markdown
    .replace(REGEX_FENCED_CODE_BLOCK, replacer) //// Remove fenced code blocks
    .replace(/<!--[\W\w]+?-->/g, replacer) //// Remove comments
    .replace(/^---[\W\w]+?(\r?\n)---/, replacer); //// Remove YAML front matter
}

function findInMarkdown(markdown, regex) {
  const unique = new Set();
  let match;

  while ((match = regex.exec(markdown))) {
    const [, name] = match;

    if (name) {
      unique.add(name);
    }
  }

  return Array.from(unique);
}
