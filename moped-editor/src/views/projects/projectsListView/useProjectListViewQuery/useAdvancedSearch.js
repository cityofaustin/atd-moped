import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { PROJECT_LIST_VIEW_FILTERS_CONFIG } from "../ProjectsListViewFiltersConf";
import { FiltersCommonOperators } from "src/components/GridTable/FiltersCommonOperators";

/* Names of advanced search URL parameters */
export const advancedSearchFilterParamName = "filters";
export const advancedSearchIsOrParamName = "isOr";

/**
 * if filter exists in url, get the values and try to parse them
 * Used to initialize filter state
 * @return Object
 */
const useMakeFilterState = (searchParams) =>
  useMemo(() => {
    if (Array.from(searchParams).length > 0) {
      const filterSearchParams = searchParams.get(
        advancedSearchFilterParamName
      );
      if (filterSearchParams === null) return [];

      try {
        return JSON.parse(filterSearchParams);
      } catch {
        return [];
      }
    }
    return [];
  }, [searchParams]);

/**
 * Build an array of filter strings to be used in generating the advanced search where string
 * @param {Object} filters - Stores filters assigned random id and nests column, operator, and value
 * @return Object
 */
const makeAdvancedSearchWhereFilters = (filters) =>
  Object.keys(filters)
    .map((filter) => {
      let { field, value, operator } = filters[filter];

      // Use field name to get the filter config and GraphQL operator config for that field
      const filterConfigForField = PROJECT_LIST_VIEW_FILTERS_CONFIG.fields.find(
        (fieldConfig) => fieldConfig.name === field
      );
      const { type } = filterConfigForField;

      // Use operator name to get the GraphQL operator config for that operator
      const operatorConfig = FiltersCommonOperators[operator];
      let {
        envelope,
        specialNullValue,
        operator: gqlOperator,
      } = operatorConfig;

      // If we have no operator, then there is nothing we can do.
      if (field === null || gqlOperator === null) {
        return null;
      }

      if (gqlOperator.includes("is_null")) {
        // Some fields when empty are not null but rather an empty string or "None"
        if (specialNullValue) {
          gqlOperator = envelope === "true" ? "_eq" : "_neq";
          value = specialNullValue;
        } else {
          value = envelope;
        }
      } else {
        if (value !== null) {
          // If there is an envelope, insert value in envelope.
          value = envelope ? envelope.replace("{VALUE}", value) : value;

          // If it is a number or boolean, it does not need quotation marks
          // Otherwise, add quotation marks for the query to identify as string
          value = type in ["number", "boolean"] ? value : `"${value}"`;
        } else {
          // We don't have a value
          return null;
        }
      }
      return `${field}: { ${gqlOperator}: ${value} }`;
    })
    .filter((value) => value !== null);

export const useAdvancedSearch = () => {
  /* Get advanced filters settings from search params if they exist */
  let [searchParams] = useSearchParams();
  const initialFilterState = useMakeFilterState(searchParams);

  /* Determine or/any from search params if it exists */
  const isOrFromSearchParams = searchParams.get(advancedSearchIsOrParamName);
  const initialIsOrState = isOrFromSearchParams === "true" ? true : false;
  const [isOr, setIsOr] = useState(initialIsOrState);

  /**
   * Stores filters assigned random id and nests column, operator, and value.
   * @type {Object} filters
   * @function setFilter - Sets the state of filters
   * @default {if filter in url, use those params, otherwise {}}
   */
  const [filters, setFilters] = useState(initialFilterState);

  const advancedSearchWhereString = useMemo(() => {
    const advancedFilters = makeAdvancedSearchWhereFilters(filters);
    if (advancedFilters.length === 0) return null;

    const bracketedFilters = advancedFilters.map((filter) => `{ ${filter} }`);

    if (isOr) {
      // Ex. _or: [{project_lead: {_eq: "COA ATD Project Delivery"}}, {project_sponsor: {_eq: "COA ATD Active Transportation & Street Design"}}]
      return `_or: [${bracketedFilters.join(",")}]`;
    } else {
      // Ex. project_lead: {_eq: "COA ATD Project Delivery"}, project_sponsor: {_eq: "COA ATD Active Transportation & Street Design"}
      return `_and: [${bracketedFilters.join(",")}]`;
    }
  }, [filters, isOr]);

  return {
    filters,
    setFilters,
    advancedSearchWhereString,
    isOr,
    setIsOr,
  };
};
