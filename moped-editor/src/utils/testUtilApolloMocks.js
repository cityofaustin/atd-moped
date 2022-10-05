import { LOOKUP_TABLES_QUERY } from "src/queries/project";

export const apolloMocks = [
  {
    request: {
      query: LOOKUP_TABLES_QUERY,
    },
    result: {
      data: {
        moped_fund_sources: [],
        moped_types: [],
        moped_entity: [],
        moped_tags: [],
      },
    },
  },
];
