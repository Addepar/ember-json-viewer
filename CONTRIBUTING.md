# How To Contribute

This repo is a monorepo, for additional instructions, refer to the package.json files in the workspaces,
or refer to the Github Workflow that runs CI.

## Installation

- `git clone <repository-url>`
- `cd ember-json-viewer`
- `pnpm install`

## Linting

Each workspace has a `lint` run-script.
You can run them all via:

```
pnpm --filter '*' lint
```

## Running tests

In one terminal, start the addon build:

```
cd addon/ && pnpm start
```

In another terminal, start the test-app build:

```
cd test-app/ && pnpm start
```

Visit the tests in the browser at localhost:4200/tests.

Alternatively, run tests via CLI with: `pnpm test`

## Running the docs application

Start the addon build in another terminal window:

```
cd addon/ && pnpm start
```

Then start the docs app:

```
cd docs-app/ && pnpm start
```
