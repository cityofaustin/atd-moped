/**
 * The Query configuration for the navigation search input
 * @constant
 * @type {object}
 * @augments NavigationSearchFiltersConf
 * @default
 */
export const NAVIGATION_SEARCH_QUERY_CONFIG = {
  options: {
    useQuery: {
      fetchPolicy: "cache-first", // Default is "cache-first", or use "no-cache"
    },
  },
  table: "project_list_view",
  limit: 10,
  orderBy: "{ updated_at: desc }",
  columns: {
    project_id: {
      search: {
        operator: "_eq",
        quoted: false,
        envelope: "%{VALUE}%",
        invalidValueDefault: 0,
      },
      type: "Int",
    },
    project_name_full: {
      search: {
        operator: "_ilike",
        quoted: true,
        envelope: "%{VALUE}%",
      },
      type: "String",
    },
    project_description: {
      search: {
        operator: "_ilike",
        quoted: true,
        envelope: "%{VALUE}%",
      },
      type: "String",
    },
    ecapris_subproject_id: {
      search: {
        operator: "_ilike",
        quoted: true,
        envelope: "%{VALUE}%",
      },
      type: "string",
    },
  },
};
