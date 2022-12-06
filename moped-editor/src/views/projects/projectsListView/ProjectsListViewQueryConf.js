import React from "react";
import { ProjectsListViewFiltersConf } from "./ProjectsListViewFiltersConf";
import { ProjectsListViewExportConf } from "./ProjectsListViewExportConf";
import ExternalLink from "../../../components/ExternalLink";
import { NavLink as RouterLink } from "react-router-dom";
import { filterProjectTeamMembers } from "./helpers.js";
import { formatTimeStampTZType } from "src/utils/dateAndTime";

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
      fetchPolicy: "cache-first", // Default is "cache-first", or use "no-cache"
    },
  },
  table: "project_list_view",
  single_item: "/moped/projects",
  new_item: "/moped/projects/new",
  new_item_label: "New Project",
  showDateRange: false,
  showSearchBar: true,
  showFilters: false,
  showExport: true,
  showNewItemButton: false,
  noResultsMessage: "No projects found.",
  showPagination: true,
  pagination: {
    rowsPerPageOptions: [5, 10, 25, 50, 100],
  },
  filters: ProjectsListViewFiltersConf,
  export: ProjectsListViewExportConf,
  search: {
    placeholder:
      "Search by ID, name, description, phase, lead, sponsor, partners, eCAPRIS ID...",
    defaultFieldsOperator: "_or",
  },
  columns: {
    project_id: {
      hidden: true,
      primary_key: true,
      searchable: true,
      sortable: false,
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
      sortable: false,
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
      filter: (values) => {
        const jsonValues = JSON.parse(values);
        return (
          <RouterLink
            to={`/${jsonValues.singleItem}/${jsonValues.link}/`}
            state={jsonValues.state}
            className={"MuiTypography-colorPrimary"}
          >
            {jsonValues.data}
          </RouterLink>
        );
      },
    },
    project_description: {
      hidden: true,
      searchable: true,
      sortable: false,
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
      sortable: false,
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
      sortable: false,
      hidden: true,
    },
    project_team_members: {
      searchable: false,
      sortable: false,
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
      sortable: true,
      label: "eCAPRIS ID",
      filter: (value) => (
        <ExternalLink
          text={value}
          url={`https://ecapris.austintexas.gov/index.cfm?fuseaction=subprojects.subprojectData&SUBPROJECT_ID=${value}`}
        />
      ),
      type: "number",
      search: {
        label: "Search by eCapris subproject ID",
        operator: "_eq",
        quoted: false,
        envelope: "%{VALUE}%",
        invalidValueDefault: 0,
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
    // the following column configurations only work with material table and do not have the
    // necessary details to work with Grid Table
    task_order: {
      type: "array",
    },
    task_order_name: {
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
  },
  // This object gets consumed into the GQLAbstract system, and here is the single, un-nested order_by directive. ✅
  order_by: { updated_at: "desc" },
  where: {
    is_deleted: "_eq: false",
  },
  or: null,
  and: null,
  limit: 100,
  offset: 0,
};
