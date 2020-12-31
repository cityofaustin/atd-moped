/**
 * Filter Configuration
 * @constant
 * @type {Object}
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
    string_contains_case_insensitive: {
      operator: "_ilike",
      label: "Contains",
      description: "String is contained in field (case-insensitive)",
      /*
          Envelope:
            % sign is used to pattern match any sequence of zero or more characters.
            _ sign is used to match any single character.
            {VALUE} is exactly the value of the entered string
        */
      envelope: "%{VALUE}%",
      type: "string",
    },
    string_begins_with_case_insensitive: {
      operator: "_ilike",
      label: "Begins With",
      description: "Field content begins with string (case-insensitive)",
      /*
          Envelope:
            % sign is used to pattern match any sequence of zero or more characters.
            _ sign is used to match any single character.
            {VALUE} is exactly the value of the entered string
            use null to pass value directly or do not define
        */
      envelope: "{VALUE}%",
      type: "string",
    },
    string_ends_with_case_insensitive: {
      operator: "_ilike",
      label: "Ends With",
      description: "Field content ends with string (case-insensitive)",
      /*
          Envelope:
            % sign is used to pattern match any sequence of zero or more characters.
            _ sign is used to match any single character.
            {VALUE} is exactly the value of the entered string
            use null to pass value directly or do not define
        */
      envelope: "%{VALUE}",
      type: "string",
    },
    string_equals_case_insensitive: {
      operator: "_ieq",
      label: "Equals",
      description: "Field content equals string (case-insensitive)",
      /*
          Envelope:
            % sign is used to pattern match any sequence of zero or more characters.
            _ sign is used to match any single character.
            {VALUE} is exactly the value of the entered string
            use null to pass value directly or do not define
        */
      envelope: null,
      type: "string",
    },
    number_equals: {
      operator: "_eq",
      label: "Equals",
      description: "The field value is equal to number.",
      envelope: null,
      type: "number",
    },
    number_greater_than: {
      operator: "_gt",
      label: "Greater Than",
      description: "The field value is greater than number and not equal.",
      envelope: null,
      type: "number",
    },
    number_less_than: {
      operator: "_lt",
      label: "Less Than",
      description: "The field value is less than number and not equal.",
      envelope: null,
      type: "number",
    },
    date_greater_than: {
      operator: "_gt",
      label: "Greater Than",
      description: "The date is greater than.",
      envelope: null,
      type: "date",
    },
    date_less_than: {
      operator: "_lt",
      label: "Less Than",
      description: "The date is less than.",
      envelope: null,
      type: "date",
    },
  },
};
