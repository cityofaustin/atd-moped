import { OPERATORS_WITHOUT_SEARCH_VALUES } from "src/views/projects/projectsListView/ProjectsListViewFiltersConf";
import { useMemo } from "react";

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
  // If we are testing a number or array type field with a non null value
  if (["number", "array"].includes(type) && !!filterParameter.value) {
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
 * @param {string} operator - The chosen operator name
 * @param {boolean} loading - Whether the lookup table is still loading
 * @param {Array} lookupOperators - operators set in filter config to show autocomplete
 * @returns {boolean}
 */
export const shouldRenderAutocompleteInput = (
  lookupTable,
  operator,
  loading,
  lookupOperators
) => {
  return lookupTable && !loading && lookupOperators.includes(operator);
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
    filterParameters.forEach((filter) => {
      const { field: fieldName, value, operator } = filter;
      const fieldConfig = filtersConfig[fieldName];
      const type = fieldConfig?.type;

      if (fieldName === null) {
        feedback.push("• One or more fields have not been selected.");
      }

      if (operator === null) {
        feedback.push("• One or more operators have not been selected.");
      }

      if (value === null || value?.trim() === "") {
        if (operator && !isFilterNullType(operator)) {
          feedback.push("• One or more missing values.");
        }
      }
      if (!checkIsValidInput(filter, type)) {
        feedback.push("• One or more invalid inputs.");
      }
    });
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

/**
 * If filter exists in url, get the values and try to parse them
 * Used to initialize filter state
 * @param {Object} searchParams - The URL search parameters
 * @param {String} advancedSearchFilterParamName
 * @param {Boolean} isEmptyFilterNeeded - toggle adding an empty filter to add initial row in the Filters component
 * @return {Object}
 */
export const useMakeFilterState = ({
  searchParams,
  advancedSearchFilterParamName,
  isEmptyFilterNeeded = false,
}) =>
  useMemo(() => {
    if (Array.from(searchParams).length > 0) {
      const filterSearchParams = searchParams.get(
        advancedSearchFilterParamName
      );
      if (filterSearchParams === null) {
        return isEmptyFilterNeeded ? [generateEmptyFilter()] : [];
      }
      try {
        return JSON.parse(filterSearchParams);
      } catch {
        return isEmptyFilterNeeded ? [generateEmptyFilter()] : [];
      }
    }
    return isEmptyFilterNeeded ? [generateEmptyFilter()] : [];
  }, [searchParams, advancedSearchFilterParamName, isEmptyFilterNeeded]);

/**
 *  Use option formatter and dedupe items to handle cases like same team member name options
 * See https://github.com/mui/material-ui/issues/26492
 * @param {Object} filtersConfig - Configuration for the filters
 * @param {Array} data - raw lookup tables
 * @return {Array} of deduped and formatted lookup table data
 */
export const useCreateAutocompleteOptions = (filtersConfig, data) =>
  useMemo(() => {
    if (!data) {
      return {};
    }
    let dedupedOptions = {};
    Object.keys(filtersConfig).forEach((fieldName) => {
      const fieldConfig = filtersConfig[fieldName];
      if (fieldConfig.lookup) {
        const { table_name: lookupTable, getOptionLabel } =
          fieldConfig?.lookup ?? {};
        const options = data[lookupTable]
          ? data[lookupTable].map((option) => getOptionLabel(option))
          : [];
        dedupedOptions = {
          ...dedupedOptions,
          [fieldConfig.name]: [...new Set(options)],
        };
      }
    });
    return dedupedOptions;
  }, [filtersConfig, data]);
