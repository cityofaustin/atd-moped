import { OPERATORS_WITHOUT_SEARCH_VALUES } from "src/views/projects/projectsListView/ProjectsListViewFiltersConf";
import { AUTOCOMPLETE_OPERATORS } from "src/views/projects/projectsListView/ProjectsListViewFiltersConf";

/**
 * Generates a copy of an empty filter
 * @return {Object}
 */
export const generateEmptyFilter = () => {
  /**
   * The default structure of an empty filter
   * @type {Object}
   * @property {string} field - The name of the column
   * @property {operator} operator - The name of the operator
   * @property {string} value - The text value to be searched
   * @constant
   * @default
   */
  const defaultNewFilterState = {
    field: null,
    operator: null,
    value: null,
  };
  return { ...defaultNewFilterState };
};

/**
 * Returns whether the user input value for the filterParameter is valid
 * @param {object} filterParameter - filter value, field, and operator
 * @param {string} type - type of field
 * @returns {boolean}
 */
export const checkIsValidInput = (filterParameter, type) => {
  // If we are testing a number type field with a non null value
  if (type === "number" && !!filterParameter.value) {
    // Return whether string only contains digits
    return !/[^0-9]/.test(filterParameter.value);
  }
  return true; // Otherwise the input is valid
};

/**
 * Returns true if the GraphQL operator is null type and has no value to search (is blank, is not blank)
 * @param {String} operator - operator to check
 * @returns {boolean}
 */
export const isFilterNullType = (operator) => {
  return operator && OPERATORS_WITHOUT_SEARCH_VALUES.includes(operator);
};

/**
 * Returns true if Field has a lookup table associated with it and operator is case sensitive
 * @param {string} lookupTable -  the lookup table name
 * @param {string} operator - The operator name
 * @param {boolean} loading - Whether the lookup table is still loading
 * @returns {boolean}
 */
export const shouldRenderAutocompleteInput = (
  lookupTable,
  operator,
  loading
) => {
  return lookupTable && !loading && AUTOCOMPLETE_OPERATORS.includes(operator);
};

/**
 * Check if a filter has complete values
 * @param {Object} filter - contains value, field, and operator
 * @returns {boolean}
 */
export const isFilterComplete = (filter) => {
  return (
    !!filter.field &&
    !!filter.operator &&
    (!!filter.value || isFilterNullType(filter.operator))
  );
};

/**
 * Check if all filters added have complete values
 * @param {Array} filterParameters - filter values, fields, and operators
 * @returns {boolean}
 */
export const areAllFiltersComplete = (filterParameters) => {
  return filterParameters.every((filter) => isFilterComplete(filter));
};

/**
 * Returns an array of strings containing messages about the filters.
 * Returns null if no problems were found.
 * @param {Array} filterParameters - filter values, fields, and operators
 * @param {Object} filtersConfig - configuration for all filters to get field type
 * @return {[]|null}
 */
export const handleApplyValidation = (filterParameters, filtersConfig) => {
  let feedback = [];

  if (filterParameters) {
    if (filterParameters.length === 0) {
      feedback.push("• No filters have been added.");
    } else {
      filterParameters.forEach((filter) => {
        const { field: fieldName, value, operator } = filter;
        const fieldConfig = filtersConfig.fields.find(
          (field) => field.name === fieldName
        );
        const type = fieldConfig?.type;

        if (fieldName === null) {
          feedback.push("• One or more fields have not been selected.");
        }

        if (operator === null) {
          feedback.push("• One or more operators have not been selected.");
        }

        if (value === null || value.trim() === "") {
          if (operator && !isFilterNullType(operator)) {
            feedback.push("• One or more missing values.");
          }
        }
        if (!checkIsValidInput(filter, type)) {
          feedback.push("• One or more invalid inputs.");
        }
      });
    }
  }
  return feedback.length > 0 ? feedback : null;
};

/**
 * Return the default operator for a given field or a fallback operator if one is not defined in config
 * @param {Object} filterConfigForField - Config for column in PROJECT_LIST_VIEW_FILTERS_CONFIG
 * @return String
 */
export const getDefaultOperator = (filterConfigForField) => {
  const { defaultOperator, operators } = filterConfigForField;
  const fallbackOperator = operators[0];

  const isDefaultOperator = Boolean(defaultOperator);

  return isDefaultOperator ? defaultOperator : fallbackOperator;
};
