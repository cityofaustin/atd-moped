import React from "react";
import ExternalLink from "../../../components/ExternalLink";
import { NavLink as RouterLink } from "react-router-dom";
import theme from "src/theme/index";

/**
 * The Query configuration (now also including filters)
 * @constant
 * @type {object}
 * @augments NavigationSearchFiltersConf
 * @default
 */
export const NavigationSearchQueryConf = {
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
    rowsPerPageOptions: [250, 1000],
  },
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
            style={{ color: theme.palette.primary.main }}
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
  },
  // This object gets consumed into the GQLAbstract system, and here is the single, un-nested order_by directive. ✅
  order_by: { updated_at: "desc" },
  where: null,
  or: null,
  and: null,
  limit: 250,
  offset: 0,
};
