---
title: Gatsby CLI
---

Follow these steps to create a new site using the [Gatsby CLI](https://www.gatsbyjs.org/docs/gatsby-cli/):

<Note>

This guide assumes that you have some familiarity with the command line, and have Node.js and npm installed locally. Check out [nodejs.org](https://nodejs.org) for more information. You will need npm v5.2.0 or higher to use the [`npx`](https://blog.npmjs.org/post/162869356040/introducing-npx-an-npm-package-runner) command in step 1.

</Note>

## 1. Scaffold a new site

Use the Gatsby CLI and the Doctocat starter to scaffold a new site:

```shell
npx gatsby new my-site https://github.com/primer/doctocat-starter
```

`my-site` is an arbitrary title — you can pick anything. Running the above command will place the code for your new site in a new directory called “my-site”. If you want to create a new site in an existing repository, be sure to run the `gatsby new` command from within that repository.

## 2. Navigate into the site directory

Navigate into the newly created site directory using `cd`:

```shell
cd my-site
```

Check out the [getting started guide](/getting-started) for more information about the important files and subdirectories in your new site directory.

## 3. Start the development server

Use the `develop` npm script to start Gatsby's hot-reloading development environment:

```shell
npm run develop
```

To view your site locally, navigate to http://localhost:8000 in your browser. Each page of the site corresponds to a file in the `content` directory. Navigate to any page then try editing the corresponding MDX file. You should see the page update in real time.

## What's next?

Check out the [customization](/usage/customization) and [deployment](/usage/deployment) guides.
