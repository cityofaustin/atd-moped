import { type CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: {
    "http://localhost:8082/v1/graphql": {
      headers: {
        "x-hasura-admin-secret": "hasurapassword",
      },
    },
  },
  documents: ["src/queries/project.js", "src/queries/components.js"],
  generates: {
    "./src/gql/": {
      preset: "client",
      config: {
        skipTypeNameForRoot: true,
        nonOptionalTypename: true,
        useTypeImports: true,
        scalars: {
          timestamptz: "string",
        },
      },
    },
  },
  hooks: { afterAllFileWrite: ["prettier --write"] },
};

export default config;
