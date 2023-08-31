/**
 * The Query configuration (now also including filters)
 * @constant
 * @type {object}
 * @augments NavigationSearchFiltersConf
 * @default
 */
export const NavigationSearchQueryConf = {
  options: {
    useQuery: {
      fetchPolicy: "cache-first", // Default is "cache-first", or use "no-cache"
    },
  },
  table: "project_list_view",
  search: {
    placeholder:
      "Search by ID, name, description, phase, lead, sponsor, partners, eCAPRIS ID...",
    defaultFieldsOperator: "_or",
  },
  columns: {
    project_id: {
      searchable: true,
      search: {
        operator: "_eq",
        quoted: false,
        envelope: "%{VALUE}%",
        invalidValueDefault: 0,
      },
      type: "Int",
    },
    project_name: {
      searchable: true,
      search: {
        operator: "_ilike",
        quoted: true,
        envelope: "%{VALUE}%",
      },
      type: "String",
    },
    project_description: {
      searchable: true,
      search: {
        operator: "_ilike",
        quoted: true,
        envelope: "%{VALUE}%",
      },
      type: "String",
    },
    ecapris_subproject_id: {
      searchable: true,
      search: {
        operator: "_ilike",
        quoted: true,
        envelope: "%{VALUE}%",
      },
      type: "string",
    },
  },
  // This object gets consumed into the GQLAbstract system, and here is the single, un-nested order_by directive. ✅
  order_by: { updated_at: "desc" },
  where: null,
  or: null,
  and: null,
  limit: 250,
  offset: 0,
};
