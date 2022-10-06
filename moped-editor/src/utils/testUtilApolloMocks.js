import { LOOKUP_TABLES_QUERY } from "src/queries/project";

export const apolloMocks = [
  {
    request: {
      query: LOOKUP_TABLES_QUERY,
    },
    result: {
      data: {
        moped_fund_sources: [],
        moped_types: [
          { type_id: 1, type_name: "this is an option" },
          { type_id: 2, type_name: "this is an option too" },
        ],
        moped_entity: [],
        moped_tags: [],
      },
    },
  },
];
