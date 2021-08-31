# @theowenyoung/gatsby-transformer-references

Transformer plugin to extract references between markdown nodes. You can then use them to create bi-directional links.

An example site for using this plugin is at [https://wiki.owenyoung.com/](https://wiki.owenyoung.com/)

## Install

```shell
npm install --save @theowenyoung/gatsby-transformer-references
```

## How to use

```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    // after a markdown or Mdx transformer
    {
      resolve: `@theowenyoung/gatsby-transformer-references`,
      options: {
        types: ["Mdx"], // or ["MarkdownRemark"] (or both)
      },
    },
  ],
};
```

### Configuration options

**`types`** [Array<string>][optional]

The types of the nodes to transform. Defaults to `['Mdx']`

## How to query for references

Two types of references are available: `outboundReferences` and `inboundReferences`.

The fields will be created in your site's GraphQL schema on the nodes of types specified in the options.

```graphql
{
  allMdx {
    outboundReferences {
      ... on Mdx {
        id
      }
    }
    inboundReferences {
      ... on Mdx {
        id
      }
    }
  }
}
```
