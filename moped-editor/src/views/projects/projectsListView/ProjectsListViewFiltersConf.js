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
      label: "Project Name",
      placeholder: "Enter project name",
      type: "string",
      defaultOperator: "string_contains_case_insensitive",
      operators: [
        "string_contains_case_insensitive",
        "string_begins_with_case_insensitive",
        "string_ends_with_case_insensitive",
        "string_is_null",
        "string_is_not_null",
      ],
    },
    {
      name: "project_description",
      label: "Project Description",
      placeholder: "Enter project description",
      type: "string",
      defaultOperator: "string_contains_case_insensitive",
      operators: [
        "string_contains_case_insensitive",
        "string_begins_with_case_insensitive",
        "string_ends_with_case_insensitive",
        "string_is_null",
        "string_is_not_null",
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
      label: "Start Date",
      placeholder: "Select date",
      type: "date",
      operators: [
        "*", // All of them (shortcut)
      ],
    },
    {
      name: "current_phase",
      label: "Currrent Phase",
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
    // {
    //   name: "moped_proj_personnel: { moped_user: { first_name  ",
    //   label: "Project Team members",
    //   placeholder: "Team member",
    //   type: "stringify",
    //   operators: [
    //     "string_contains_case_insensitive",
    //     "string_begins_with_case_insensitive",
    //     "string_ends_with_case_insensitive",
    //   ],
    // },
  ],

  operators: {
    ...GridTableFiltersCommonOperators,
  },
};
