# Versa JS

Monorepo for public JavaScript packages developed by Versa, including a component library and Storybook.

## Storybook

Storybook deployment is under development. Check back soon!

## Packages

Packages are available under the [@versa](https://www.npmjs.com/org/versaprotocol) org on npm.

### Belt

A utility library containiing common functions and helpers for working with Versa receipt data

### React

A ReactJS component library for displaying Versa receipts

### Schema

TypeScript interfaces for the Versa receipt model

## Package Management

We use [changesets](https://github.com/changesets/changesets) for package management.

- `pnpm run build` Build the distributable packages
- `changeset`
- `changeset version` Bump the package versions
- `changeset publish` Publish the packages to npm

## Bundle Analysis

Use `npm pack --dry-run` to view the published contents of packages before publishing. This is useful for verifying that the correct files are being published and for troubleshooting unexpectedly large bundle sizes.

**Remember:** .npmignore files won't override package.json `files` rules from the top level of the package (i.e. on the same level as `package.json`) — for that reason, .npmignore is checked in from within the `dist` directory in @versa/react, for example
