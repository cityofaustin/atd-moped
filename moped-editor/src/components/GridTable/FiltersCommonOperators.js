export const FiltersCommonOperators = {
  string_contains_case_insensitive: {
    operator: "_ilike",
    label: "contains",
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
  string_contains_not_case_insensitive: {
    operator: "_nilike",
    label: "contains not",
    description: "String is NOT contained in field (case-insensitive)",
    envelope: "%{VALUE}%",
    type: "string",
  },
  string_is_null: {
    operator: "_is_null",
    label: "is blank",
    description: "Selected field is null",
    envelope: "true",
    type: "string",
  },
  string_is_not_null: {
    operator: "_is_null",
    label: "is not blank",
    description: "Selected field is not null",
    envelope: "false",
    type: "string",
  },
  string_is_blank: {
    operator: "_is_null",
    label: "is blank",
    description: "Selected field is blank",
    envelope: "true",
    specialNullValue: '""',
    type: "string",
  },
  string_is_not_blank: {
    operator: "_is_null",
    label: "is not blank",
    description: "Selected field is not blank",
    envelope: "false",
    specialNullValue: '""',
    type: "string",
  },
  string_begins_with_case_insensitive: {
    operator: "_ilike",
    label: "begins with",
    description: "Field content begins with string (case-insensitive)",
    envelope: "{VALUE}%",
    type: "string",
  },
  string_ends_with_case_insensitive: {
    operator: "_ilike",
    label: "ends with",
    description: "Field content ends with string (case-insensitive)",
    envelope: "%{VALUE}",
    type: "string",
  },
  number_equals: {
    operator: "_eq",
    label: "is",
    description: "The field value is equal to number.",
    envelope: null,
    type: "number",
  },
  number_does_not_equal: {
    operator: "_neq",
    label: "is not",
    description: "The field value is not equal to number.",
    envelope: null,
    type: "number",
  },
  number_greater_than: {
    operator: "_gt",
    label: "greater than",
    description: "The field value is greater than number and not equal.",
    envelope: null,
    type: "number",
  },
  number_greater_than_equal_to: {
    operator: "_gte",
    label: "greater than or equal to",
    description: "The number is less than or equal to.",
    envelope: null,
    type: "number",
  },
  number_less_than: {
    operator: "_lt",
    label: "less than",
    description: "The field value is less than number and not equal.",
    envelope: null,
    type: "number",
  },
  number_less_than_equal_to: {
    operator: "_lte",
    label: "less than or equal to",
    description: "The number is less than or equal to.",
    envelope: null,
    type: "number",
  },
  date_equals: {
    operator: "_eq",
    label: "is",
    description: "The date is equal to.",
    envelope: null,
    type: "date",
  },
  date_greater_than: {
    operator: "_gt",
    label: "greater than",
    description: "The date is greater than.",
    envelope: null,
    type: "date",
  },
  date_greater_than_equal_to: {
    operator: "_gte",
    label: "greater than or equal to",
    description: "The date is greater than or equal to.",
    envelope: null,
    type: "date",
  },
  date_less_than: {
    operator: "_lt",
    label: "less than",
    description: "The date is less than.",
    envelope: null,
    type: "date",
  },
  date_less_than_equal_to: {
    operator: "_lte",
    label: "less than or equal to",
    description: "The date is less than or equal to.",
    envelope: null,
    type: "date",
  },
  string_equals_case_insensitive: {
    operator: "_ilike",
    label: "is",
    description: "Field content equals string (case-sensitive)",
    envelope: null,
    type: "string",
  },
  string_does_not_equal_case_insensitive: {
    operator: "_nilike",
    label: "is not",
    description: "Field content does not equal string (case-sensitive)",
    envelope: null,
    type: "string",
  },
  subprojects_array_is_null: {
    operator: "_is_null",
    label: "No",
    description: "Project does not have subprojects",
    type: "array",
    envelope: "true",
  },
  subprojects_array_is_not_null: {
    operator: "_is_null",
    label: "Yes",
    description: "Project has subprojects",
    type: "array",
    envelope: "false",
  },
  council_districts_array_is_null: {
    operator: "_is_null",
    label: "is blank",
    description: "Project has no mapped components in council districts",
    type: "array",
    envelope: "true",
  },
  council_districts_array_is_not_null: {
    operator: "_is_null",
    label: "is not blank",
    description: "Project has components in council districts",
    type: "array",
    envelope: "false",
  },
  council_districts_array_contains: {
    operator: "_contains",
    label: "contains",
    description: "Project has components in a given council district",
    type: "array",
    envelope: false,
  },
  council_districts_array_is: {
    operator: "_eq",
    label: "is",
    description: "Project has components in, and only in, specific council districts",
    type: "array",
    envelope: false,
  },
};
