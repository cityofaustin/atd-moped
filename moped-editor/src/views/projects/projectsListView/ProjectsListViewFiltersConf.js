import { GridTableFiltersCommonOperators } from "../../../components/GridTable/GridTableFiltersCommonOperators";

/**
 * Filter Configuration
 * @constant
 * @type {object}
 * @default
 */
export const ProjectsListViewFiltersConf = {
  fields: [
    {
      name: "project_name",
      label: "Project name",
      placeholder: "Enter project name",
      type: "string",
      defaultOperator: "string_contains_case_insensitive",
      operators: [
        "string_contains_case_insensitive",
        "string_begins_with_case_insensitive",
        "string_ends_with_case_insensitive",
      ],
    },
    {
      name: "project_description",
      label: "Project description",
      placeholder: "Enter project description",
      type: "string",
      defaultOperator: "string_contains_case_insensitive",
      operators: [
        "string_contains_case_insensitive",
        "string_begins_with_case_insensitive",
        "string_ends_with_case_insensitive",
      ],
    },
    {
      name: "project_id",
      label: "Project ID",
      placeholder: "Type Project ID number",
      type: "number",
      defaultOperator: "number_equals",
      operators: [
        "*", // All of them (shortcut)
      ],
    },
    {
      name: "start_date",
      label: "Start date",
      placeholder: "Select date",
      type: "date",
      operators: [
        "*", // All of them (shortcut)
      ],
    },
    {
      name: "status_name",
      label: "Current status",
      placeholder: "Current status",
      type: "string",
      operators: [
        "string_contains_case_insensitive",
        "string_begins_with_case_insensitive",
        "string_ends_with_case_insensitive",
        "string_is_null",
        "string_is_not_null",
      ],
    },
    {
      name: "current_phase",
      label: "Current phase",
      placeholder: "Current phase",
      type: "string",
      operators: [
        "string_contains_case_insensitive",
        "string_begins_with_case_insensitive",
        "string_ends_with_case_insensitive",
        "string_is_null",
        "string_is_not_null",
      ],
    },
    {
      name: "project_team_members",
      label: "Team member",
      placeholder: "Team member",
      type: "string",
      operators: [
        "string_contains_case_insensitive",
        "string_begins_with_case_insensitive",
        "string_ends_with_case_insensitive",
        // Because of the way the SQL view concatanates the team members and roles
        // " :" is always present even if there are no team members present
        "string_is_null_special_case",
        "string_is_not_null_special_case",
      ],
    },
    {
      name: "project_sponsor",
      label: "Project sponsor",
      placeholder: "Project sponsor",
      type: "string",
      operators: [
        "string_contains_case_insensitive",
        "string_begins_with_case_insensitive",
        "string_ends_with_case_insensitive",
        "string_is_null",
        "string_is_not_null",
      ],
    },
    {
      name: "project_partner",
      label: "Project partners",
      placeholder: "Project partners",
      type: "string",
      operators: [
        "string_contains_case_insensitive",
        "string_begins_with_case_insensitive",
        "string_ends_with_case_insensitive",
        "string_is_null",
        "string_is_not_null",
      ],
    },
  ],

  operators: {
    ...GridTableFiltersCommonOperators,
  },
};
