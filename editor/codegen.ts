import { type CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: {
    "http://localhost:8082/v1/graphql": {
      headers: {
        "x-hasura-admin-secret": "hasurapassword",
      },
    },
  },
  documents: ["src/queries/*.ts"],
  generates: {
    "./src/gql/": {
      preset: "client",
      presetConfig: {
        /* Spread fragment fields into the parent type instead of exposing $fragmentRefs */
        fragmentMasking: false,
      },
      config: {
        skipTypeNameForRoot: true,
        useTypeImports: true,
        scalars: {
          timestamptz: "string",
          citext: "string",
        },
      },
    },
  },
  hooks: { afterAllFileWrite: ["prettier --write"] },
};

export default config;
