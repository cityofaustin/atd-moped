import React from "react";
import { ProjectsListViewFiltersConf } from "./ProjectsListViewFiltersConf";
import { ProjectsListViewExportConf } from "./ProjectsListViewExportConf";
import ExternalLink from "../../../components/ExternalLink";
import { NavLink as RouterLink } from "react-router-dom";


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
    placeholder:
      "Search by project name, project description, and eCAPRIS subproject ID.",
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
      label: "Project Name",
      search: {
        label: "Search by project name",
        operator: "_ilike",
        quoted: true,
        envelope: "%{VALUE}%",
      },
      width: "*",
      type: "String",
      filter: values => {
        const jsonValues = JSON.parse(values)
        return (
          <RouterLink
            to={`/${jsonValues.singleItem}/${jsonValues.link}`}
          >
            {jsonValues.data}
          </RouterLink>
        )
      }
    },
    project_description: {
      hidden: true,
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
    current_phase: {
      searchable: true,
      sortable: false,
      label: "Current Phase",
      width: "15%",
      search: {
        label: "Search by current phase",
        operator: "_ilike",
        quoted: true,
        envelope: "%{VALUE}%",
      },
      type: "string",
    },
    "moped_proj_personnel (where: {status_id: { _eq:1 }}) { moped_user { first_name last_name } moped_project_role { project_role_name }}": {
      searchable: false,
      sortable: false,
      stringify: true,
      label: "Team Members",
      width: "20%",
      filter: value => {
        const parsedJson = JSON.parse(value)
        let uniqueNames = {}
        let personnel = []

        parsedJson.forEach(person => {
          let fullName = person.moped_user.first_name + " " + person.moped_user.last_name
          if (uniqueNames[fullName]) {
            uniqueNames[fullName] = uniqueNames[fullName] + `, ${person.moped_project_role.project_role_name}`
          } else {
            uniqueNames[fullName] = person.moped_project_role.project_role_name
          }
        })

        for (const [key, value] of Object.entries(uniqueNames)) {
          personnel.push(`${key} - ${value}`)
        }

        return personnel.join("\n")
      }
    },
    start_date: {
      searchable: false,
      sortable: true,
      label: "Start Date",
      width: "10%",
      filter: value => new Date(value).toLocaleDateString('en-US', {timeZone: 'UTC'}),
      type: "date_iso",
    },
    ecapris_subproject_id: {
      hidden: false,
      searchable: true,
      sortable: true,
      label: "eCapris Subp.",
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
        invalidValueDefault: 0
      },
    },
  },
  order_by: {},
  where: {
    is_retired: "_eq: false"
  },
  limit: 25,
  offset: 0,
};
