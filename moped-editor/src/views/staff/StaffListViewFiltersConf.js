import { GridTableFiltersCommonOperators } from "../../components/GridTable/GridTableFiltersCommonOperators";

/**
 * Filter Configuration
 * @constant
 * @type {object}
 * @default
 */
export const StaffListViewFiltersConf = {
  fields: [
    {
      name: "first_name",
      label: "First Name",
      placeholder: "Enter first name",
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
      name: "last_name",
      label: "Last Name",
      placeholder: "Enter last name",
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
      name: "email",
      label: "E-Mail",
      placeholder: "Enter email",
      type: "string",
      operators: [
        "*", // All of them (shortcut)
      ],
    },
    {
      name: "title",
      label: "Title",
      placeholder: "Enter title",
      type: "string",
      operators: [
        "*", // All of them (shortcut)
      ],
    },
    {
      name: "workgroup",
      label: "Workgroup",
      placeholder: "Enter Workgroup",
      type: "string",
      operators: [
        "*", // All of them (shortcut)
      ],
    },
    {
      name: "is_coa_staff",
      label: "Is COA Staff",
      placeholder: "Select Staff",
      type: "boolean",
      operators: [
        "*", // All of them (shortcut)
      ],
    },
  ],

  operators: {
    ...GridTableFiltersCommonOperators,
  },
};
