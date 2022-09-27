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
        "string_equals_case_sensitive",
        "string_does_not_equal_case_sensitive",
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
        "string_equals_case_sensitive",
        "string_does_not_equal_case_sensitive",
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
      name: "type_name",
      label: "Project type",
      placeholder: "Enter Project type",
      type: "string",
      defaultOperator: "string_equals_case_sensitive",
      lookup: {
        table_name: "moped_types",
        field_name: "type_name"
      },
      operators: [
        "string_equals_case_sensitive",
        "string_does_not_equal_case_sensitive",
        "string_contains_case_insensitive",
        "string_begins_with_case_insensitive",
        "string_ends_with_case_insensitive",
        "string_is_null",
        "string_is_not_null",
      ],
    },
    {
      name: "updated_at",
      label: "Last modified",
      placeholder: "Last modified",
      type: "date",
      operators: [
        "date_equals",
        "date_greater_than",
        "date_greater_than_equal_to",
        "date_less_than",
        "date_less_than_equal_to",
      ],
    },
    {
      name: "current_phase",
      label: "Status",
      placeholder: "Status",
      type: "string",
      operators: [
        "string_equals_case_sensitive",
        "string_does_not_equal_case_sensitive",
        "string_contains_case_insensitive",
        "string_begins_with_case_insensitive",
        "string_ends_with_case_insensitive",
        "string_is_blank",
        "string_is_not_blank",
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
        "string_equals_case_sensitive",
        "string_does_not_equal_case_sensitive",
        "string_is_null",
        "string_is_not_null",
      ],
    },
    {
      name: "project_sponsor",
      label: "Project sponsor",
      placeholder: "Project sponsor",
      type: "string",
      lookup: {
        table_name: "moped_entity",
        field_name: "entity_name"
      },
      operators: [
        "string_contains_case_insensitive",
        "string_begins_with_case_insensitive",
        "string_ends_with_case_insensitive",
        "string_equals_case_sensitive",
        "string_does_not_equal_case_sensitive",
        "string_is_null_special_case",
        "string_is_not_null_special_case",
      ],
    },
    {
      name: "project_partner",
      label: "Project partners",
      placeholder: "Project partners",
      type: "string",
      lookup: {
        table_name: "moped_entity",
        field_name: "entity_name"
      },
      operators: [
        "string_contains_case_insensitive",
        "string_begins_with_case_insensitive",
        "string_ends_with_case_insensitive",
        "string_equals_case_sensitive",
        "string_does_not_equal_case_sensitive",
        "string_is_null",
        "string_is_not_null",
      ],
    },
    {
      name: "task_order_name",
      label: "Task orders",
      placeholder: "Task order",
      type: "string",
      operators: [
        "string_contains_case_insensitive",
        "string_begins_with_case_insensitive",
        "string_ends_with_case_insensitive",
        "string_equals_case_sensitive",
        "string_does_not_equal_case_sensitive",
        "string_is_null",
        "string_is_not_null",
      ],
    },
    {
      name: "funding_source_name",
      label: "Funding source",
      placeholder: "Funding source",
      type: "string",
      lookup: {
        table_name: "moped_fund_sources",
        field_name: "funding_source_name"
      },
      operators: [
        "string_contains_case_insensitive",
        "string_begins_with_case_insensitive",
        "string_ends_with_case_insensitive",
        "string_equals_case_sensitive",
        "string_does_not_equal_case_sensitive",
        "string_is_null",
        "string_is_not_null",
      ],
    },
    {
      name: "project_note",
      label: "Status update",
      placeholder: "Status update",
      type: "string",
      operators: [
        "string_contains_case_insensitive",
        "string_begins_with_case_insensitive",
        "string_ends_with_case_insensitive",
        "string_equals_case_sensitive",
        "string_does_not_equal_case_sensitive",
        "string_is_null",
        "string_is_not_null",
      ],
    },
    {
      name: "construction_start_date",
      label: "Construction start",
      placeholder: "Construction start",
      type: "date",
      operators: [
        "date_equals",
        "date_greater_than",
        "date_greater_than_equal_to",
        "date_less_than",
        "date_less_than_equal_to",
      ],
    },
    {
      name: "completion_end_date",
      label: "Project completion",
      placeholder: "Project completion",
      type: "date",
      operators: [
        "date_equals",
        "date_greater_than",
        "date_greater_than_equal_to",
        "date_less_than",
        "date_less_than_equal_to",
      ],
    },
    {
      name: "project_designer",
      label: "Designer",
      placeholder: "Designer",
      type: "string",
      operators: [
        "string_contains_case_insensitive",
        "string_begins_with_case_insensitive",
        "string_ends_with_case_insensitive",
        "string_equals_case_sensitive",
        "string_does_not_equal_case_sensitive",
        "string_is_null",
        "string_is_not_null",
      ],
    },
    {
      name: "project_inspector",
      label: "Inspector",
      placeholder: "Inspector",
      type: "string",
      operators: [
        "string_contains_case_insensitive",
        "string_begins_with_case_insensitive",
        "string_ends_with_case_insensitive",
        "string_equals_case_sensitive",
        "string_does_not_equal_case_sensitive",
        "string_is_null",
        "string_is_not_null",
      ],
    },
    {
      name: "contractors",
      label: "Contractors",
      placeholder: "Contractor",
      type: "string",
      operators: [
        "string_contains_case_insensitive",
        "string_begins_with_case_insensitive",
        "string_ends_with_case_insensitive",
        "string_equals_case_sensitive",
        "string_does_not_equal_case_sensitive",
        "string_is_null",
        "string_is_not_null",
      ],
    },
    {
      name: "contract_numbers",
      label: "Contract numbers",
      placeholder: "Contract number",
      type: "string",
      operators: [
        "string_contains_case_insensitive",
        "string_begins_with_case_insensitive",
        "string_ends_with_case_insensitive",
        "string_equals_case_sensitive",
        "string_does_not_equal_case_sensitive",
        "string_is_null",
        "string_is_not_null",
      ],
    },
  ],

  operators: {
    ...GridTableFiltersCommonOperators,
  },
};
