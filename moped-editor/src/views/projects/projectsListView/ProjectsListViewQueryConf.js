import React from "react";
import { ProjectsListViewFiltersConf } from "./ProjectsListViewFiltersConf";
import { ProjectsListViewExportConf } from "./ProjectsListViewExportConf";
import ExternalLink from "../../../components/ExternalLink";
import { NavLink as RouterLink } from "react-router-dom";
import { filterProjectTeamMembers } from "./helpers.js"

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
  showPagination: true,
  pagination: {
    rowsPerPageOptions: [5, 10, 25, 50, 100],
  },
  filters: ProjectsListViewFiltersConf,
  export: ProjectsListViewExportConf,
  search: {
    placeholder:
      "Search by project name, project description, project phase, or eCAPRIS subproject ID.",
    defaultFieldsOperator: "_or",
  },
  columns: {
    project_id: {
      hidden: true,
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
      filter: values => {
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
    current_status: {
      searchable: false,
      sortable: false,
      hidden: true,
      label: "Status",
      type: "String",
      width: "5%",
    },
    status_id: {
      hidden: true,
      searchable: false,
    },
    current_phase: {
      searchable: true,
      sortable: false,
      label: "Status",
      width: "15%",
      badge: "status_id",
      search: {
        label: "Search by current phase",
        operator: "_ilike",
        quoted: true,
        envelope: "%{VALUE}%",
      },
      type: "string",
    },
    project_team_members: {
      searchable: false,
      sortable: false,
      label: "Team members",
      width: "20%",
      filter: filterProjectTeamMembers,
    },
    entity_name: {
      label: "Project sponsor",
      searchable: true,
      search: {
        label: "Search by project sponsor",
        operator: "_ilike",
        quoted: true,
        envelope: "%{VALUE}%",
      },
      type: "string",
    },
    start_date: {
      searchable: false,
      sortable: true,
      label: "Start date",
      width: "10%",
      filter: value =>
        new Date(value).toLocaleDateString("en-US", { timeZone: "UTC" }),
      type: "date_iso",
    },
    ecapris_subproject_id: {
      hidden: false,
      searchable: true,
      sortable: true,
      label: "eCAPRIS ID",
      filter: value => (
        <ExternalLink
          text={value}
          url={`https://ecapris.austintexas.gov/index.cfm?fuseaction=subprojects.subprojectData&SUBPROJECT_ID=${value}`}
        />
      ),
      type: "number",
      search: {
        label: "Search by eCapris subproject id",
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
      filter: value => new Date(value).toLocaleDateString("en-US"),
      type: "date_iso",
    },
  },
  order_by: { updated_at: "desc" },
  where: {
    is_retired: "_eq: false",
    status_id: "_neq: 3",
  },
  or: null,
  and: null,
  limit: 25,
  offset: 0,
};
