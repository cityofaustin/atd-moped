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
      hidden: true,
    },
    project_team_members: {
      searchable: false,
      label: "Team members",
      width: "20%",
      filter: filterProjectTeamMembers,
    },
    project_lead: {
      label: "Project lead",
      searchable: true,
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
    },
    task_order_names: {
      type: "string",
    },
    project_feature: {
      type: "array",
    },
    type_name: {
      type: "string",
    },
    funding_source_name: {
      type: "string",
    },
    project_note: {
      type: "string",
    },
    construction_start_date: {
      type: "date",
    },
    completion_end_date: {
      type: "date",
    },
    project_inspector: {
      type: "string",
    },
    project_designer: {
      type: "string",
    },
    contractors: {
      type: "string",
    },
    contract_numbers: {
      type: "string",
    },
    project_tags: {
      type: "string",
    },
    added_by: {
      type: "string",
    },
    interim_project_id: {
      type: "Int",
    },
    children_project_ids: {
      type: "array",
    },
    parent_project_id: {
      type: "Int",
    },
    parent_project_name: {
      type: "string",
    },
    components: {
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
