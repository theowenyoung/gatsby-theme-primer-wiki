module.exports = pluginOptions => {
  const options = Object.assign(
    {
      extensions: [`.mdx`, '.md', '.markdown'],
      mediaTypes: [`text/markdown`, `text/x-markdown`],
      sourceInstanceName: '',
      summaryPath: '',
      root: process.cwd(),
      shouldBlockNodeFromTransformation: () => false,
    },
    pluginOptions,
  )
  return options
}
