import React from "react";
import { PROJECT_LIST_VIEW_FILTERS_CONFIG } from "./ProjectsListViewFiltersConf";
import { PROJECT_LIST_VIEW_EXPORT_CONFIG } from "./ProjectsListViewExportConf";
import ExternalLink from "../../../components/ExternalLink";
import { filterProjectTeamMembers } from "./helpers.js";
import { formatTimeStampTZType } from "src/utils/dateAndTime";

/**
 * The Query configuration (now also including filters)
 * @constant
 * @type {object}
 * @augments PROJECT_LIST_VIEW_FILTERS_CONFIG
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
  showSearchBar: true,
  showFilters: false,
  showExport: true,
  showNewItemButton: false,
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
  filters: PROJECT_LIST_VIEW_FILTERS_CONFIG,
  export: PROJECT_LIST_VIEW_EXPORT_CONFIG,
  search: {
    placeholder:
      "Search by ID, name, description, phase, lead, sponsor, partners, eCAPRIS ID...",
    defaultFieldsOperator: "_or",
  },
  columns: {
    project_id: {
      searchable: true, // useSearch
      sortable: true,
      label: "Project ID",
      search: {
        label: "Search by project ID",
        operator: "_eq",
        quoted: false,
        envelope: "%{VALUE}%",
        invalidValueDefault: 0,
      },
      icon: {
        name: "edit_road",
        color: "primary",
      },
      width: "*",
      type: "Int",
    },
    project_name: {
      searchable: true,
      sortable: true,
      link: "project_id",
      label: "Project name",
      search: {
        label: "Search by project name",
        operator: "_ilike",
        quoted: true,
        envelope: "%{VALUE}%",
      },
      width: "*",
      type: "String",
    },
    project_description: {
      hidden: true,
      searchable: true,
      sortable: true,
      label: "Project description",
      search: {
        label: "Search by project description",
        operator: "_ilike",
        quoted: true,
        envelope: "%{VALUE}%",
      },
      width: "50%",
      type: "String",
    },
    current_phase: {
      searchable: true,
      sortable: true,
      label: "Status",
      width: "15%",
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
      hidden: true,
    },
    project_team_members: {
      searchable: false,
      sortable: true,
      label: "Team members",
      width: "20%",
      filter: filterProjectTeamMembers,
    },
    project_lead: {
      label: "Project lead",
      searchable: true,
      sortable: true,
      search: {
        label: "Search by project lead",
        operator: "_ilike",
        quoted: true,
        envelope: "%{VALUE}%",
      },
      type: "string",
      filter: (value) => (value === "None" ? "-" : value),
    },
    project_sponsor: {
      label: "Project sponsor",
      searchable: true,
      sortable: true,
      search: {
        label: "Search by project sponsor",
        operator: "_ilike",
        quoted: true,
        envelope: "%{VALUE}%",
      },
      type: "string",
      filter: (value) => (value === "None" ? "-" : value),
    },
    project_partner: {
      label: "Project partners",
      searchable: true,
      sortable: true,
      search: {
        label: "Search by project partners",
        operator: "_ilike",
        quoted: true,
        envelope: "%{VALUE}%",
      },
      type: "string",
    },
    ecapris_subproject_id: {
      hidden: false,
      searchable: true,
      sortable: true,
      label: "eCAPRIS ID",
      filter: (value) => (
        <ExternalLink
          text={value}
          url={`https://ecapris.austintexas.gov/index.cfm?fuseaction=subprojects.subprojectData&SUBPROJECT_ID=${value}`}
        />
      ),
      type: "string",
      search: {
        label: "Search by eCapris subproject ID",
        operator: "_ilike",
        quoted: true,
        envelope: "%{VALUE}%",
      },
    },
    updated_at: {
      hidden: false,
      searchable: false,
      sortable: true,
      label: "Last modified",
      filter: (value) => formatTimeStampTZType(value),
      type: "date_iso",
    },
    public_process_status: {
      label: "Public process status",
      searchable: false,
      type: "string",
    },
    // the following column configurations only work with material table and do not have the
    // necessary details to work with Grid Table
    task_orders: {
      type: "array",
      sortable: true,
    },
    task_order_names: {
      type: "string",
      sortable: true,
    },
    project_feature: {
      type: "array",
      sortable: false,
    },
    type_name: {
      type: "string",
      sortable: true,
    },
    funding_source_name: {
      type: "string",
      sortable: true,
    },
    project_note: {
      type: "string",
      sortable: true,
    },
    construction_start_date: {
      type: "date",
      sortable: true,
    },
    completion_end_date: {
      type: "date",
      sortable: true,
    },
    project_inspector: {
      type: "string",
      sortable: true,
    },
    project_designer: {
      type: "string",
      sortable: true,
    },
    contractors: {
      type: "string",
      sortable: true,
    },
    contract_numbers: {
      type: "string",
      sortable: true,
    },
    project_tags: {
      type: "string",
      sortable: true,
    },
    added_by: {
      type: "string",
      sortable: true,
    },
    interim_project_id: {
      type: "Int",
      sortable: true,
    },
    children_project_ids: {
      type: "array",
      sortable: true,
    },
    parent_project_id: {
      type: "Int",
      sortable: true,
    },
    parent_project_name: {
      type: "string",
      sortable: true,
    },
    components: {
      type: "string",
      sortable: true,
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
