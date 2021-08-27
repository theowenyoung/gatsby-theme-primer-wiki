---
tags:
  - Nodejs
  - Tips
  - Programming-Languages
---

# Nodejs Tips

## Answers

### Delete node_modules folder recursively from a specified path using command line

> [Delete node_modules folder recursively from a specified path using command line - Stack Overflow](https://stackoverflow.com/questions/42950501/delete-node-modules-folder-recursively-from-a-specified-path-using-command-line)

```bash
find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +
```

### Get NPM Token

```bash
npm token create
```
