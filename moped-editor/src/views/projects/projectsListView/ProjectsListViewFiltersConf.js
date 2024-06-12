import { FiltersCommonOperators } from "../../../components/GridTable/FiltersCommonOperators";

/**
 * Array of operators that should be autocompleted
 * @constant
 * @type {array}
 * @default
 */
export const AUTOCOMPLETE_OPERATORS = [
  "string_equals_case_insensitive",
  "string_does_not_equal_case_insensitive",
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
  "subprojects_array_is_null",
  "subprojects_array_is_not_null",
  "string_is_blank",
  "string_is_not_blank",
  "council_districts_array_is_null",
  "council_districts_array_is_not_null",
  "date_is_null",
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
      name: "project_name_full",
      label: "Full name",
      placeholder: "Enter full project name",
      type: "string",
      defaultOperator: "string_contains_case_insensitive",
      operators: [
        "string_equals_case_insensitive",
        "string_does_not_equal_case_insensitive",
        "string_contains_case_insensitive",
        "string_begins_with_case_insensitive",
        "string_ends_with_case_insensitive",
      ],
    },
    {
      name: "project_name",
      label: "Name",
      placeholder: "Enter project name",
      type: "string",
      defaultOperator: "string_contains_case_insensitive",
      operators: [
        "string_equals_case_insensitive",
        "string_does_not_equal_case_insensitive",
        "string_contains_case_insensitive",
        "string_begins_with_case_insensitive",
        "string_ends_with_case_insensitive",
      ],
    },
    {
      name: "project_name_secondary",
      label: "Secondary name",
      placeholder: "Enter secondary project name",
      type: "string",
      defaultOperator: "string_contains_case_insensitive",
      operators: [
        "string_equals_case_insensitive",
        "string_does_not_equal_case_insensitive",
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
        "string_equals_case_insensitive",
        "string_does_not_equal_case_insensitive",
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
        "number_does_not_equal",
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
      defaultOperator: "string_equals_case_insensitive",
      lookup: {
        table_name: "moped_types",
        getOptionLabel: (option) => option.type_name,
        operators: [
          "string_equals_case_insensitive",
          "string_does_not_equal_case_insensitive",
        ],
      },
      operators: [
        "string_equals_case_insensitive",
        "string_does_not_equal_case_insensitive",
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
        "date_is_null",
      ],
    },
    {
      name: "current_phase",
      label: "Status",
      placeholder: "Status",
      type: "string",
      operators: [
        "string_equals_case_insensitive",
        "string_does_not_equal_case_insensitive",
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
      lookup: {
        table_name: "moped_users",
        getOptionLabel: (option) => `${option.first_name} ${option.last_name}`,
        operators: [
          "string_contains_case_insensitive",
          "string_equals_case_insensitive",
        ],
      },
      operators: [
        "string_contains_case_insensitive",
        "string_begins_with_case_insensitive",
        "string_ends_with_case_insensitive",
        // "string_equals_case_insensitive",
        // "string_does_not_equal_case_insensitive",
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
        getOptionLabel: (option) => option.entity_name,
        operators: [
          "string_equals_case_insensitive",
          "string_does_not_equal_case_insensitive",
        ],
      },
      operators: [
        "string_contains_case_insensitive",
        "string_begins_with_case_insensitive",
        "string_ends_with_case_insensitive",
        "string_equals_case_insensitive",
        "string_does_not_equal_case_insensitive",
        "string_is_null",
        "string_is_not_null",
      ],
    },
    {
      name: "project_sponsor",
      label: "Sponsor",
      placeholder: "Project sponsor",
      type: "string",
      lookup: {
        table_name: "moped_entity",
        getOptionLabel: (option) => option.entity_name,
        operators: [
          "string_equals_case_insensitive",
          "string_does_not_equal_case_insensitive",
        ],
      },
      operators: [
        "string_contains_case_insensitive",
        "string_begins_with_case_insensitive",
        "string_ends_with_case_insensitive",
        "string_equals_case_insensitive",
        "string_does_not_equal_case_insensitive",
        "string_is_null",
        "string_is_not_null",
      ],
    },
    {
      name: "project_partners",
      label: "Partners",
      placeholder: "Project partners",
      type: "string",
      lookup: {
        table_name: "moped_entity",
        getOptionLabel: (option) => option.entity_name,
        operators: [
          "string_equals_case_insensitive",
          "string_does_not_equal_case_insensitive",
        ],
      },
      operators: [
        "string_contains_case_insensitive",
        "string_begins_with_case_insensitive",
        "string_ends_with_case_insensitive",
        "string_equals_case_insensitive",
        "string_does_not_equal_case_insensitive",
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
        "string_equals_case_insensitive",
        "string_does_not_equal_case_insensitive",
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
        getOptionLabel: (option) => option.funding_source_name,
        operators: [
          "string_equals_case_insensitive",
          "string_does_not_equal_case_insensitive",
        ],
      },
      operators: [
        "string_contains_case_insensitive",
        "string_begins_with_case_insensitive",
        "string_ends_with_case_insensitive",
        "string_equals_case_insensitive",
        "string_does_not_equal_case_insensitive",
        "string_is_null",
        "string_is_not_null",
      ],
    },
    {
      name: "project_status_update",
      label: "Status update",
      placeholder: "Status update",
      type: "string",
      operators: [
        "string_contains_case_insensitive",
        "string_begins_with_case_insensitive",
        "string_ends_with_case_insensitive",
        "string_equals_case_insensitive",
        "string_does_not_equal_case_insensitive",
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
        "date_is_null",
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
        "date_is_null",
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
        "string_equals_case_insensitive",
        "string_does_not_equal_case_insensitive",
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
        "string_equals_case_insensitive",
        "string_does_not_equal_case_insensitive",
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
        "string_equals_case_insensitive",
        "string_does_not_equal_case_insensitive",
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
        "string_equals_case_insensitive",
        "string_does_not_equal_case_insensitive",
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
        getOptionLabel: (option) => option.name,
        operators: [
          "string_equals_case_insensitive",
          "string_does_not_equal_case_insensitive",
        ],
      },
      operators: [
        "string_contains_case_insensitive",
        "string_begins_with_case_insensitive",
        "string_ends_with_case_insensitive",
        "string_equals_case_insensitive",
        "string_does_not_equal_case_insensitive",
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
        "string_equals_case_insensitive",
        "string_does_not_equal_case_insensitive",
      ],
    },
    {
      name: "public_process_status",
      label: "Public process status",
      placeholder: "Public process status",
      type: "string",
      lookup: {
        table_name: "moped_public_process_statuses",
        getOptionLabel: (option) => option.name,
        operators: [
          "string_equals_case_insensitive",
          "string_does_not_equal_case_insensitive",
        ],
      },
      operators: [
        "string_contains_case_insensitive",
        "string_begins_with_case_insensitive",
        "string_ends_with_case_insensitive",
        "string_equals_case_insensitive",
        "string_does_not_equal_case_insensitive",
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
        "number_does_not_equal",
        "number_greater_than",
        "number_greater_than_equal_to",
        "number_less_than",
        "number_less_than_equal_to",
      ],
    },
    {
      name: "children_project_ids",
      label: "Has subprojects",
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
    {
      name: "project_and_child_project_council_districts",
      label: "Council districts",
      placeholder: "District",
      type: "array",
      operators: [
        "council_districts_array_is_null",
        "council_districts_array_is_not_null",
        "council_districts_array_contains",
        "council_districts_array_is",
      ],
    },
  ],

  operators: {
    ...FiltersCommonOperators,
  },
};
