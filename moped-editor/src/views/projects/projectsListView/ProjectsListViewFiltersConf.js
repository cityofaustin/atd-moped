import { FiltersCommonOperators } from "../../../components/GridTable/FiltersCommonOperators";

/**
 * Array of operators that should be autocompleted
 * @constant
 * @type {array}
 * @default
 */
export const AUTOCOMPLETE_OPERATORS = [
  "string_equals_case_sensitive",
  "string_does_not_equal_case_sensitive",
];

/**
 * Array of operators that do not require a search value Ex. "is blank"
 * @constant
 * @type {array}
 * @default
 */
export const OPERATORS_WITHOUT_SEARCH_VALUES = [
  "string_is_null",
  "string_is_not_null",
  "string_is_not_null_special_case",
  "string_is_null_special_case",
  "subprojects_array_is_null",
  "subprojects_array_is_not_null",
  "string_is_blank",
  "string_is_not_blank",
];

/**
 * Filter Configuration
 * @constant
 * @type {object}
 * @default
 */
export const PROJECT_LIST_VIEW_FILTERS_CONFIG = {
  fields: [
    {
      name: "project_name",
      label: "Name",
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
      label: "Description",
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
      label: "ID",
      placeholder: "Type Project ID number",
      type: "number",
      defaultOperator: "number_equals",
      operators: [
        "number_equals",
        "number_greater_than",
        "number_greater_than_equal_to",
        "number_less_than",
        "number_less_than_equal_to",
      ],
    },
    {
      name: "type_name",
      label: "Type",
      placeholder: "Enter Project type",
      type: "string",
      defaultOperator: "string_equals_case_sensitive",
      lookup: {
        table_name: "moped_types",
        field_name: "type_name",
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
      label: "Modified",
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
      label: "Team",
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
      name: "project_lead",
      label: "Lead",
      placeholder: "Project lead",
      type: "string",
      lookup: {
        table_name: "moped_entity",
        field_name: "entity_name",
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
      name: "project_sponsor",
      label: "Sponsor",
      placeholder: "Project sponsor",
      type: "string",
      lookup: {
        table_name: "moped_entity",
        field_name: "entity_name",
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
      label: "Partners",
      placeholder: "Project partners",
      type: "string",
      lookup: {
        table_name: "moped_entity",
        field_name: "entity_name",
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
      name: "task_order_names",
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
        field_name: "funding_source_name",
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
      label: "Completion date",
      placeholder: "Completion date",
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
      name: "workgroup_contractors",
      label: "Workgroup/Contractors",
      placeholder: "Workgroup or Contractor",
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
    {
      name: "project_tags",
      label: "Tags",
      placeholder: "Tags",
      type: "string",
      lookup: {
        table_name: "moped_tags",
        field_name: "name",
      },
      operators: [
        "string_contains_case_insensitive",
        "string_begins_with_case_insensitive",
        "string_ends_with_case_insensitive",
        "string_equals_case_sensitive",
        "string_does_not_equal_case_sensitive",
      ],
    },
    {
      name: "added_by",
      label: "Created by",
      placeholder: "Created by",
      type: "string",
      operators: [
        "string_contains_case_insensitive",
        "string_begins_with_case_insensitive",
        "string_ends_with_case_insensitive",
        "string_equals_case_sensitive",
        "string_does_not_equal_case_sensitive",
      ],
    },
    {
      name: "public_process_status",
      label: "Public process status",
      placeholder: "Public process status",
      type: "string",
      lookup: {
        table_name: "moped_public_process_statuses",
        field_name: "name",
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
      name: "interim_project_id",
      label: "Interim MPD (Access) ID",
      placeholder: "Interim MPD (Access) ID",
      type: "number",
      defaultOperator: "number_equals",
      operators: [
        "number_equals",
        "number_greater_than",
        "number_greater_than_equal_to",
        "number_less_than",
        "number_less_than_equal_to",
      ],
    },
    {
      name: "children_project_ids",
      label: "Has Subprojects",
      placeholder: "Subproject",
      type: "array",
      operators: ["subprojects_array_is_null", "subprojects_array_is_not_null"],
    },
    {
      name: "components",
      label: "Components",
      placeholder: "component",
      type: "string",
      operators: [
        "string_contains_case_insensitive",
        "string_is_null",
        "string_is_not_null",
      ],
    },
  ],

  operators: {
    ...FiltersCommonOperators,
  },
};
