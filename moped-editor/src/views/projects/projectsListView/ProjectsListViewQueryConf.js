import { ProjectsListViewFiltersConf } from "./ProjectsListViewFiltersConf";

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
  showSearchBar: false,
  showFilters: true,
  showPagination: true,
  pagination: {
    rowsPerPageOptions: [5, 10, 25, 50, 100],
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
