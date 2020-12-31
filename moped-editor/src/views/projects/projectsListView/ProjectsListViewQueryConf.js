/**
 * Filter Configuration
 * @constant
 * @type {Object}
 * @default
 */
export const ProjectsListViewFiltersConf = {
  fields: [
    {
      name: "project_name",
      label: "Project Name",
      type: "string",
      operators: [
        "string_contains_case_insensitive",
        "string_begins_with_case_insensitive",
        "string_ends_with_case_insensitive",
      ],
    },
    {
      name: "project_description",
      label: "Project Description",
      type: "string",
      operators: [
        "string_contains_case_insensitive",
        "string_begins_with_case_insensitive",
        "string_ends_with_case_insensitive",
      ],
    },
    {
      name: "project_id",
      label: "Project ID",
      type: "number",
      operators: [
        "*", // All of them (shortcut)
      ],
    },
  ],

  operators: {
    string_contains_case_insensitive: {
      id: "string_contains_case_insensitive",
      operator: "_ilike",
      label: "Contains",
      description: "String is contained in field (case-insensitive)",
      /*
        Envelope:
          % sign is used to pattern match any sequence of zero or more characters.
          _ sign is used to match any single character.
          {VALUE} is exactly the value of the entered string
      */
      envelope: "%{VALUE}%",
      type: "string",
    },
    string_begins_with_case_insensitive: {
      id: "string_begins_with_case_insensitive",
      operator: "_ilike",
      label: "Begins With",
      description: "Field content begins with string (case-insensitive)",
      /*
        Envelope:
          % sign is used to pattern match any sequence of zero or more characters.
          _ sign is used to match any single character.
          {VALUE} is exactly the value of the entered string
          use null to pass value directly or do not define
      */
      envelope: "{VALUE}%",
      type: "string",
    },
    string_ends_with_case_insensitive: {
      id: "string_ends_with_case_insensitive",
      operator: "_ilike",
      label: "Ends With",
      description: "Field content ends with string (case-insensitive)",
      /*
        Envelope:
          % sign is used to pattern match any sequence of zero or more characters.
          _ sign is used to match any single character.
          {VALUE} is exactly the value of the entered string
          use null to pass value directly or do not define
      */
      envelope: "%{VALUE}",
      type: "string",
    },
    string_equals_case_insensitive: {
      id: "string_equals_case_insensitive",
      operator: "_ieq",
      label: "Equals",
      description: "Field content equals string (case-insensitive)",
      /*
        Envelope:
          % sign is used to pattern match any sequence of zero or more characters.
          _ sign is used to match any single character.
          {VALUE} is exactly the value of the entered string
          use null to pass value directly or do not define
      */
      envelope: null,
      type: "string",
    },
    number_equals: {
      id: "number_equals",
      operator: "_eq",
      label: "Equals",
      description: "The field value is equal to number.",
      envelope: null,
      type: "number",
    },
    number_greater_than: {
      id: "number_greater_than",
      operator: "_gt",
      label: "Greater Than",
      description: "The field value is greater than number and not equal.",
      envelope: null,
      type: "number",
    },
    number_less_than: {
      id: "number_less_than",
      operator: "_lt",
      label: "Less Than",
      description: "The field value is less than number and not equal.",
      envelope: null,
      type: "number",
    },
  },
};

/**
 * The Query configuration (now also including filters)
 * @constant
 * @type {Object}
 * @augments ProjectsListViewFiltersConf
 * @default
 */
export const ProjectsListViewQueryConf = {
  options: {
    useQuery: {
      fetchPolicy: "no-cache", // Default ise "cache-first", or use "no-cache"
      // Use no-cache as per issue https://github.com/cityofaustin/atd-data-tech/issues/4788
      // More info: https://www.apollographql.com/docs/react/get-started/#graphql-config-options-fetchPolicy
    },
  },
  table: "moped_project",
  single_item: "/moped/projects",
  showDateRange: false,
  pagination: {
    rowsPerPageOptions: [1, 5, 10, 25, 50, 100],
  },
  filters: ProjectsListViewFiltersConf,
  columns: {
    project_id: {
      primary_key: true,
      searchable: false,
      sortable: false,
      label_search: "",
      label_table: "",
      icon: {
        name: "edit_road",
        color: "primary",
      },
      width: "*",
      type: "Int",
    },
    project_name: {
      searchable: true,
      sortable: false,
      label_search: "Project Name",
      label_table: "Project Name",
      width: "20%",
      type: "String",
    },
    project_description: {
      searchable: true,
      sortable: false,
      label_search: "Project Description",
      label_table: "Project Description",
      width: "50%",
      type: "String",
    },
    current_status: {
      searchable: false,
      sortable: false,
      label_search: null,
      label_table: "Status",
      type: "String",
      width: "5%",
      chip: {
        active: "primary",
        hold: "secondary",
        canceled: "default",
      },
    },
    date_added: {
      searchable: false,
      sortable: true,
      label_search: null,
      label_table: "Date Added",
      width: "10%",
      filter: value => new Date(value).toLocaleDateString(),
      type: "date_iso",
    },
    start_date: {
      searchable: false,
      sortable: true,
      label_search: null,
      label_table: "Start Date",
      width: "10%",
      filter: value => new Date(value).toLocaleDateString(),
      type: "date_iso",
    },
    capitally_funded: {
      searchable: false,
      sortable: false,
      label_search: null,
      label_table: "Capital Funding",
      width: "5%",
      type: "boolean",
    },
  },
  order_by: {},
  where: {},
  limit: 25,
  offset: 0,
};
