# Versa JS

Monorepo for public JavaScript packages developed by Versa, including a component library and Storybook.

## Storybook

Storybook deployment is under development. Check back soon!

## Packages

Packages are available under the [@versaprotocol](https://www.npmjs.com/org/versaprotocol) org on npm.

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
