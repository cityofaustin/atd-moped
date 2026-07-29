# Moped Editor

Web application for interacting with Moped data.

## Quick start

1. Clone this repo. Start new branches from `main`.

2. Follow [steps](https://github.com/cityofaustin/atd-moped/tree/main/moped-database#readme) to start the Moped database.

3. Copy the environment variables template and fill in the missing values from the DTS password store - these secrets should not be captured in this repository. You will see the [MUI X Missing license key warning](https://v7.mui.com/x/introduction/licensing/#1-missing-license-key) without the MUI X environment variable. Mapbox tiles and NearMap aerial imagery will be unavailable without the map tokens.

```shell
cp env_template .env.local
```

4. We use [Node Version Manager](https://github.com/nvm-sh/nvm) (`nvm`) to keep our `node` versions in sync with our environments. Install `nvm` and then run the following from this directory to activate the current `node` and `npm` version required for this project. If you don't want to use `nvm`, refer to the `.nvmrc` file for the `node` version you should install.

```shell
nvm use
nvm install-latest-npm
```

5. Install dependencies:

```shell
npm install
```

6. Start the server:

```shell
npm run dev
```

7. Open `https://localhost:3000/moped`

8. To login, locate the username and pw in the DTS password store under the name "Moped Test Editor (local, staging, prod)" or "Moped Test Admin (local, staging, prod)"

## GraphQL Codegen

We use [GraphQL Codegen](https://the-guild.dev/graphql/codegen) with the `client-preset` to generate TypeScript types from our Hasura schema and GraphQL operations. The generated files live in `src/gql/` and are committed to the repo so we can type check in the Netlify build steps.

### How it works

The Vite dev server runs codegen automatically on startup and re-runs it whenever a file in `src/queries/` is saved using [Vite Plugin GraphQL Codegen](https://www.npmjs.com/package/vite-plugin-graphql-codegen). Make sure the local Hasura stack is running before starting `npm run dev`.

Queries and mutations must be wrapped with the `graphql()` function from `src/gql` for codegen to generate types for them:

```ts
import { graphql } from "src/gql";

export const MY_QUERY = graphql(`
  query MyQuery($id: Int!) {
    my_table_by_pk(id: $id) {
      id
      name
    }
  }
`);
```

Any PR that adds or changes a file in `src/queries/` must include an updated `src/gql/` in the same commit. If the generated file is stale or missing, `npm run typecheck` will fail the Netlify build.

### Running codegen manually

```shell
npm run codegen
```

### Scoping codegen to specific files

The `documents` field in `codegen.ts` controls which query files codegen processes. During the initial migration, this is scoped to only the files that have been converted to use `graphql()`:

```ts
documents: ["src/queries/project.js", "src/queries/components.js"],
```

When converting a new query file to use `graphql()`, add it to the `documents` array. Once all files in `src/queries/` have been converted, this can be updated to:

```ts
documents: ["src/queries/**/*.{js,ts}"],
```

### Custom scalars

Hasura exposes Postgres-specific column types as GraphQL custom scalars (e.g. `timestamptz`, `uuid`, `jsonb`, `geography`). By default these map to `unknown` in the generated types. To map them to a more specific TypeScript type, add an entry to the `scalars` config in `codegen.ts`:

```ts
scalars: {
  timestamptz: "string",
  uuid: "string",
  jsonb: "Record<string, unknown>",
  geography: "GeoJSON.Geometry", // requires @types/geojson
}
```

Add mappings here as you encounter `unknown` types in the generated output.
