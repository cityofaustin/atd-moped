export const ProjectsListViewQueryConf = {
  options: {
    useQuery: {
      fetchPolicy: "cache-first", // Default
    },
  },
  table: "moped_project",
  single_item: "/moped/projects",
  showDateRange: false,
  pagination: {
    rowsPerPageOptions: [1, 5, 10, 25, 50, 100],
  },
  columns: {
    project_id: {
      primary_key: true,
      searchable: false,
      sortable: false,
      label_search: "",
      label_table: "",
      icon: "edit_road",
      type: "Int",
    },
    project_name: {
      searchable: false,
      sortable: false,
      label_search: null,
      label_table: "Project Name",
      type: "String",
    },
    project_description: {
      searchable: false,
      sortable: false,
      label_search: null,
      label_table: "Description",
      type: "String",
    },
    current_status: {
      searchable: false,
      sortable: false,
      label_search: null,
      label_table: "Status",
      type: "String",
      chip: {
        active: "primary",
        hold: "secondary",
        canceled: "disabled",
      },
    },
    date_added: {
      searchable: false,
      sortable: false,
      label_search: null,
      label_table: "Date Added",
      type: "date_iso",
    },
    start_date: {
      searchable: false,
      sortable: false,
      label_search: null,
      label_table: "Start Date",
      type: "date_iso",
    },
    capitally_funded: {
      searchable: false,
      sortable: false,
      label_search: null,
      label_table: "Capital Funding",
      type: "boolean",
    },
  },
  order_by: {},
  where: {},
  limit: 25,
  offset: 0,
};
