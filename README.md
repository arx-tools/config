# @arx-tools/config

The shared development tooling of the [arx-tools](https://github.com/arx-tools) libraries: the `xo`
and `prettier` configuration, the `tsconfig` base and the test runner. Every library uses the same
conventions, so they live here instead of being copied into each repository.

**It is development tooling only** — none of it ends up in the published library code.

## Contents

| export | what it is |
|---|---|
| `@arx-tools/config` | `createXoConfig()` and the shared `rules` of the `xo` configuration |
| `@arx-tools/config/prettier` | the shared prettier options |
| `@arx-tools/config/tsconfig.base.json` | the shared `compilerOptions` of the TypeScript projects |
| `arx-lib-test` (bin) | the `node:test` runner: a single line per test with rounded durations, and it fails when no test ran |

## Requirements

The tooling runs on the same Node.js version as the libraries' development environment:
**Node.js >= 22.18**, because the sources and the tests run directly through type stripping.

## Usage

### The `xo` configuration

```ts
// xo.config.ts
import { createXoConfig } from '@arx-tools/config'

export default createXoConfig()
```

The factory assumes the folder layout of the libraries (`src/`, `tests/`, `scripts/` with their own
`tsconfig.src.json`, `tsconfig.tests.json` and `tsconfig.scripts.json`). Anything different can be
passed in:

```ts
export default createXoConfig({
  rootDir: import.meta.dirname,
  sourceProject: './tsconfig.app.json',
  testProject: './tsconfig.spec.json',
  scriptProject: './tsconfig.tooling.json',
})
```

The shared rule set is exported as `rules` as well, so a repository can extend a copy of it instead of
using the factory.

### The prettier configuration

Prettier reads the package name from the `prettier` field of `package.json`:

```json
{
  "prettier": "@arx-tools/config/prettier"
}
```

`xo` formats with prettier through its own parser, so it picks up the same options.

### The TypeScript base

```json
{
  "extends": "@arx-tools/config/tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}
```

The base contains the target, the module settings, `strict`, and the flags which make the sources
runnable without a build: `allowImportingTsExtensions`, `rewriteRelativeImportExtensions`,
`verbatimModuleSyntax` and `erasableSyntaxOnly`.

### The test runner

```json
{
  "scripts": {
    "test": "arx-lib-test"
  }
}
```

The runner starts `node --test` with the `tests/**/*.spec.ts` pattern (any other pattern can be passed
as the first argument), prints one line per test through its own reporter and **fails when no test had
been executed** — `node --test` exits with zero for an empty glob, which makes a broken pattern look
like a green suite.

The reporter is configured by two environment variables:

| variable | values | default |
|---|---|---|
| `TEST_REPORT_FORMAT` | `flat` (one line per test), `tree` (grouped under the suites) | `flat` |
| `TEST_REPORT_DURATION` | `auto` (milliseconds below a second, seconds above it, four significant digits), `ms`, `none` | `auto` |

## Development of this package

The package compiles its TypeScript sources into `dist/` with `tsc`, so the consumers get JavaScript
and declarations from `node_modules` (the type stripping of Node.js does not apply there).

| command | what it does |
|---|---|
| `npm install` | installs the dependencies |
| `npm run lint` | check code against the pre-defined coding guidelines |
| `npm run typecheck` | type checks the sources, the tests and the config |
| `npm test` | builds nothing, runs the compiled runner against the tests |
| `npm run build` | compiles `dist/` and rewrites the `.ts` extensions in the declarations |

## License

MIT
