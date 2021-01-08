import { ProjectsListViewFiltersConf } from "./ProjectsListViewFiltersConf";
import { ProjectsListViewExportConf } from "./ProjectsListViewExportConf";

/**
 * The Query configuration (now also including filters)
 * @constant
 * @type {object}
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
  new_item: "/moped/projects/new",
  new_item_label: "New Project",
  showDateRange: false,
  showSearchBar: true,
  showFilters: false,
  showExport: true,
  showNewItemButton: true,
  showPagination: true,
  pagination: {
    rowsPerPageOptions: [5, 10, 25, 50, 100],
  },
  filters: ProjectsListViewFiltersConf,
  export: ProjectsListViewExportConf,
  search: {
    placeholder: "Search project by name, or select field.",
    defaultField: "project_name",
  },
  columns: {
    project_id: {
      primary_key: true,
      searchable: false,
      sortable: false,
      label: "",
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
      label: "Project Name",
      search: {
        label: "Search by project name",
        operator: "_ilike",
        quoted: true,
        envelope: "%{VALUE}%",
      },
      width: "20%",
      type: "String",
    },
    project_description: {
      searchable: true,
      sortable: false,
      label: "Project Description",
      search: {
        label: "Search by project description",
        operator: "_ilike",
        quoted: true,
        envelope: "%{VALUE}%",
      },
      width: "50%",
      type: "String",
    },
    current_status: {
      searchable: false,
      sortable: false,
      label: "Status",
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
      label: "Date Added",
      width: "10%",
      filter: value => new Date(value).toLocaleDateString(),
      type: "date_iso",
    },
    start_date: {
      searchable: false,
      sortable: true,
      label: "Start Date",
      width: "10%",
      filter: value => new Date(value).toLocaleDateString(),
      type: "date_iso",
    },
    capitally_funded: {
      searchable: false,
      sortable: false,
      label: "Capital Funding",
      width: "5%",
      filter: value => (value === true ? "True" : "False"),
      type: "boolean",
    },
  },
  order_by: {},
  where: {},
  limit: 25,
  offset: 0,
};
