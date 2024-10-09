/**
 * The Query configuration for the ProjectsListView component
 * @constant
 * @type {object}
 * @default
 */
export const PROJECT_LIST_VIEW_QUERY_CONFIG = {
  options: {
    useQuery: {
      fetchPolicy: "cache-and-network", // Default is "cache-first", or use "no-cache"
    },
  },
  table: "project_list_view",
  single_item: "/moped/projects",
  new_item: "/moped/projects/new",
  new_item_label: "New Project",
  showFilters: false,
  showExport: true,
  noResultsMessage: "No projects found.",
  showPagination: true,
  pagination: {
    rowsPerPageOptions: [100, 250, 1000],
    defaultOffset: 0,
    defaultLimit: 100,
  },
  order: {
    defaultColumn: "updated_at",
    defaultDirection: "desc",
  },
  search: {
    placeholder:
      "Search by ID, full name, description, phase, lead, sponsor, partners, eCAPRIS ID...",
    defaultFieldsOperator: "_or",
  },
  columns: {
    project_id: {
      searchable: true, // useSearch
      sortable: true, // useColumns
      label: "Project ID",
      defaultHidden: false, // useColumns
      showInTable: true, // useColumns
      search: {
        /* useAdvancedSearch */
        label: "Search by project ID",
        operator: "_eq",
        quoted: false,
        envelope: "%{VALUE}%",
        invalidValueDefault: 0,
      },
      type: "Int",
    },
    project_name_full: {
      searchable: true,
      sortable: true,
      link: "project_id",
      label: "Full name",
      defaultHidden: false,
      showInTable: true,
      search: {
        label: "Search by full name",
        operator: "_ilike",
        quoted: true,
        envelope: "%{VALUE}%",
      },
      type: "String",
    },
    project_name: {
      searchable: false,
      sortable: true,
      label: "Project name",
      defaultHidden: true,
      showInTable: true,
      search: {
        label: "Search by project name",
        operator: "_ilike",
        quoted: true,
        envelope: "%{VALUE}%",
      },
      type: "String",
    },
    project_name_secondary: {
      searchable: false,
      sortable: true,
      label: "Project secondary name",
      defaultHidden: true,
      showInTable: true,
      search: {
        label: "Search by project secondary name",
        operator: "_ilike",
        quoted: true,
        envelope: "%{VALUE}%",
      },
      type: "String",
    },
    project_description: {
      searchable: true,
      sortable: true,
      label: "Project description",
      defaultHidden: true,
      showInTable: true,
      search: {
        label: "Search by project description",
        operator: "_ilike",
        quoted: true,
        envelope: "%{VALUE}%",
      },
      type: "String",
    },
    current_phase: {
      searchable: true,
      sortable: true,
      label: "Status",
      defaultHidden: false,
      showInTable: true,
      search: {
        label: "Search by current phase",
        operator: "_ilike",
        quoted: true,
        envelope: "%{VALUE}%",
      },
      type: "string",
    },
    current_phase_key: {
      searchable: false,
      sortable: true,
    },
    project_team_members: {
      searchable: false,
      sortable: true,
      label: "Team members",
      defaultHidden: true,
      showInTable: true,
    },
    project_lead: {
      label: "Project lead",
      searchable: true,
      sortable: true,
      defaultHidden: false,
      showInTable: true,
      search: {
        label: "Search by project lead",
        operator: "_ilike",
        quoted: true,
        envelope: "%{VALUE}%",
      },
      type: "string",
    },
    project_sponsor: {
      label: "Project sponsor",
      searchable: true,
      sortable: true,
      defaultHidden: false,
      showInTable: true,
      search: {
        label: "Search by project sponsor",
        operator: "_ilike",
        quoted: true,
        envelope: "%{VALUE}%",
      },
      type: "string",
    },
    project_partners: {
      label: "Project partners",
      searchable: true,
      sortable: true,
      defaultHidden: true,
      showInTable: true,
      search: {
        label: "Search by project partners",
        operator: "_ilike",
        quoted: true,
        envelope: "%{VALUE}%",
      },
      type: "string",
    },
    ecapris_subproject_id: {
      searchable: true,
      sortable: true,
      label: "eCAPRIS ID",
      defaultHidden: false,
      showInTable: true,
      type: "string",
      search: {
        label: "Search by eCapris subproject ID",
        operator: "_ilike",
        quoted: true,
        envelope: "%{VALUE}%",
      },
    },
    updated_at: {
      searchable: false,
      sortable: true,
      defaultHidden: false,
      showInTable: true,
      label: "Last modified",
      type: "date_iso",
    },
    public_process_status: {
      label: "Public process status",
      searchable: false,
      type: "string",
      defaultHidden: true,
      showInTable: true,
    },
    task_orders: {
      type: "array",
      sortable: true,
      defaultHidden: true,
      showInTable: true,
    },
    task_order_names: {
      type: "string",
      sortable: true,
    },
    // signal_ids
    project_feature: {
      type: "array",
      sortable: false,
      defaultHidden: true,
      showInTable: true,
    },
    type_name: {
      type: "string",
      sortable: true,
      defaultHidden: true,
      showInTable: true,
    },
    funding_source_and_program_names: {
      type: "string",
      sortable: true,
      defaultHidden: true,
      showInTable: true,
    },
    project_status_update: {
      type: "string",
      sortable: true,
      defaultHidden: true,
      showInTable: true,
    },
    construction_start_date: {
      type: "date",
      sortable: true,
      defaultHidden: true,
      showInTable: true,
    },
    completion_end_date: {
      type: "date",
      sortable: true,
      defaultHidden: true,
      showInTable: true,
    },
    substantial_completion_date: {
      type: "date",
      sortable: true,
      defaultHidden: false,
      showInTable: true,
    },
    project_inspector: {
      type: "string",
      sortable: true,
      defaultHidden: true,
      showInTable: true,
    },
    project_designer: {
      type: "string",
      sortable: true,
      defaultHidden: true,
      showInTable: true,
    },
    workgroup_contractors: {
      type: "string",
      sortable: true,
      defaultHidden: true,
      showInTable: true,
    },
    contract_numbers: {
      type: "string",
      sortable: true,
      defaultHidden: true,
      showInTable: true,
    },
    project_tags: {
      type: "string",
      sortable: true,
      defaultHidden: true,
      showInTable: true,
    },
    added_by: {
      type: "string",
      sortable: true,
      defaultHidden: true,
      showInTable: true,
    },
    interim_project_id: {
      type: "Int",
      sortable: true,
      defaultHidden: true,
      showInTable: true,
    },
    children_project_ids: {
      type: "array",
      sortable: true,
      defaultHidden: true,
      showInTable: true,
    },
    parent_project_id: {
      type: "Int",
      sortable: false,
      defaultHidden: true,
      showInTable: true,
    },
    parent_project_name: {
      type: "string",
      sortable: true,
    },
    components: {
      type: "string",
      sortable: true,
      defaultHidden: true,
      showInTable: true,
    },
    project_and_child_project_council_districts: {
      type: "array",
      sortable: false,
      defaultHidden: true,
      showInTable: true,
    },
  },
};

/**
 * Default column display (if no config in local storage)
 */
export const DEFAULT_HIDDEN_COLS = Object.entries(
  PROJECT_LIST_VIEW_QUERY_CONFIG.columns
).reduce((acc, [columnName, config]) => {
  if (config.showInTable === true) {
    acc[columnName] = !config.defaultHidden;
  }
  return acc;
}, {});

/**
 * All columns that should be shown, set to true
 */
export const SHOW_ALL_COLS = Object.entries(
  PROJECT_LIST_VIEW_QUERY_CONFIG.columns
).reduce((acc, [columnName, config]) => {
  if (config.showInTable === true) {
    acc[columnName] = true;
  }
  return acc;
}, {});
