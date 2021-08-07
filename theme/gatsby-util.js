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
