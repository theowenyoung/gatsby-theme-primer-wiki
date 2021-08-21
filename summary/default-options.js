module.exports = (pluginOptions) => {
  const options = Object.assign(
    {
      extensions: [`.mdx`, ".md", ".markdown"],
      sourceInstanceName: "",
      summaryPath: "",
      shouldBlockNodeFromTransformation: () => false,
    },
    pluginOptions
  );
  return options;
};
