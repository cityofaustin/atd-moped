import { LOOKUP_TABLES_QUERY } from "src/queries/project";

export const apolloMocks = [
  {
    request: {
      query: LOOKUP_TABLES_QUERY,
    },
    result: {
      data: {},
    },
  },
];
