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
      operators: [
        "*", // All of them (shortcut)
      ],
    },
    {
      name: "date_added",
      label: "Date Added",
      placeholder: "Select date",
      type: "date",
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
  ],

  operators: {
    ...GridTableFiltersCommonOperators,
  },
};
