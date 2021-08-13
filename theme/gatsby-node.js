const path = require('path')
const readPkgUp = require('read-pkg-up')
const getPkgRepo = require('get-pkg-repo')
const axios = require('axios')
const uniqBy = require('lodash.uniqby')

const {createFilePath} = require(`gatsby-source-filesystem`)
const {getTitle} = require('./gatsby-util')

const CONTRIBUTOR_CACHE = new Map()

exports.createResolvers = ({createResolvers}) => {
  const resolvers = {
    MdxFrontmatter: {
      title: {
        type: 'String',
        resolve(source) {
          return source.title || ''
        },
      },
      description: {
        type: 'String',
        resolve(source) {
          return source.description || ''
        },
      },
      tags: {
        type: '[String]',
        resolve(source) {
          return source.tags || []
        },
      },
    },
  }
  createResolvers(resolvers)
}
exports.createPages = async ({graphql, actions}, themeOptions) => {
  const repo = getPkgRepo(readPkgUp.sync().packageJson)
  const postTemplate = path.resolve(__dirname, `./src/templates/post-query.js`)
  const {data} = await graphql(`
    {
      allMdx {
        nodes {
          fileAbsolutePath
          rawBody
          tableOfContents(maxDepth: 2)
          fields {
            slug
          }
          parent {
            ... on File {
              relativeDirectory
              name
            }
          }
        }
      }
    }
  `)

  if (
    !process.env.GITHUB_TOKEN &&
    !process.env.NOW_GITHUB_DEPLOYMENT &&
    !process.env.VERCEL_GITHUB_DEPLOYMENT
  ) {
    console.error(
      `Non-deploy build and no GITHUB_TOKEN environment variable set; skipping GitHub API calls`,
    )
  }

  // Turn every MDX file into a page.
  return Promise.all(
    data.allMdx.nodes.map(async node => {
      let slug = node.fields.slug
      if (!slug.endsWith('/')) {
        slug += '/'
      }
      const rootAbsolutePath = path.resolve(
        process.cwd(),
        themeOptions.repoRootPath || '.',
      )

      const fileRelativePath = path.relative(
        rootAbsolutePath,
        node.fileAbsolutePath,
      )
      const defaultBranch = themeOptions.defaultBranch || 'master'
      const editUrl = getEditUrl(repo, fileRelativePath, defaultBranch)

      let contributors = []
      // if (
      //   process.env.GITHUB_TOKEN ||
      //   process.env.NOW_GITHUB_DEPLOYMENT ||
      //   process.env.VERCEL_GITHUB_DEPLOYMENT
      // ) {
      //   contributors = await fetchContributors(
      //     repo,
      //     fileRelativePath,
      //     process.env.GITHUB_TOKEN,
      //   )
      // }

      // Copied from gatsby-plugin-mdx (https://git.io/JUs3H)
      // as a workaround for https://github.com/gatsbyjs/gatsby/issues/21837
      // const code = await mdx(node.rawBody)
      // const {frontmatter} = extractExports(code)

      actions.createPage({
        path: slug,
        component: postTemplate,
        context: {
          slug: slug,
          editUrl,
          contributors,
        },
      })
    }),
  )
}
exports.onCreateNode = async ({node, actions, getNode, loadNodeContent}) => {
  const {createNodeField} = actions

  if (node.internal.type === `Mdx`) {
    // let value = createFilePath({node, getNode})

    // const lowerCaseValue = value.toLowerCase()

    // if (lowerCaseValue.endsWith('/readme/')) {
    //   value = value.slice(0, -7)
    // }

    // createNodeField({
    //   name: `slug`,
    //   node,
    //   value,
    // })
    const title = await getTitle(node, {loadNodeContent})

    createNodeField({
      name: `title`,
      node,
      value: title || '',
    })
  }
}
function getEditUrl(repo, filePath, defaultBranch) {
  return `https://github.com/${repo.user}/${repo.project}/edit/${defaultBranch}/${filePath}`
}

async function fetchContributors(repo, filePath, accessToken = '') {
  const hash = `${repo.user}/${repo.project}/${filePath}`
  const cached = CONTRIBUTOR_CACHE.get(hash)
  if (cached) {
    return cached
  }

  try {
    const req = {
      method: 'get',
      baseURL: 'https://api.github.com/',
      url: `/repos/${repo.user}/${repo.project}/commits?path=${filePath}&per_page=100`,
    }

    if (accessToken && accessToken.length) {
      req.headers = {
        Authorization: `token ${accessToken}`,
      }
    }

    const {data} = await axios.request(req)

    const commits = data
      .map(commit => ({
        login: commit.author && commit.author.login,
        latestCommit: {
          date: commit.commit.author.date,
          url: commit.html_url,
        },
      }))
      .filter(contributor => Boolean(contributor.login))

    const result = uniqBy(commits, 'login')
    CONTRIBUTOR_CACHE.set(hash, result)
    return result
  } catch (error) {
    console.error(
      `[ERROR] Unable to fetch contributors for ${filePath}. ${error.message}`,
    )
    return []
  }
}
