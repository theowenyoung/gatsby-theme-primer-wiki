const fs = require("fs").promises;
const pathLib = require("path");
const getContent = (path) => {
  return fs.readFile(pathLib.resolve(__dirname, path), "utf-8");
};

exports.getContent = getContent;
