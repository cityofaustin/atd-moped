import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { PROJECT_LIST_VIEW_FILTERS_CONFIG } from "../ProjectsListViewFiltersConf";
import { FiltersCommonOperators } from "src/components/GridTable/FiltersCommonOperators";
import { parseGqlString } from "src/utils/gridTableHelpers";
import { addDays, parseISO, format } from "date-fns";
import { useMakeFilterState } from "src/components/GridTable/helpers";

/* Names of advanced search URL parameters */
export const advancedSearchFilterParamName = "filters";
export const advancedSearchIsOrParamName = "isOr";

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
          // Otherwise, parse as string and add quotation marks for the query to identify as string
          if (type === "array") {
            value = `[${value}]`;
          } else if (!["number", "boolean"].includes(type)) {
            value = `"${parseGqlString(value)}"`;
          }
        } else {
          // We don't have a value
          return null;
        }
      }
      let whereString = `${field}: { ${gqlOperator}: ${value} }`;
      // If we are filtering on a date there are some exceptions we need to handle bc the date/timestampz conversion
      if (type === "date" && !gqlOperator.includes("is_null")) {
        const nextDay = JSON.stringify(
          format(addDays(parseISO(value.replaceAll('"', "")), 1), "yyyy-MM-dd")
        );
        if (gqlOperator === "_eq") {
          // Greater or equal to the selected day and less than the next day will return all timestampz for the given date
          whereString = `_and: [ { ${field}: { ${`_gte`}: ${value} } }, { ${field}: { ${`_lt`}: ${nextDay} } } ]`;
        } else if (gqlOperator === "_lte") {
          // Less than the next day will give us all the timestampz that are less than or equal to the selected date
          whereString = `${field}: { ${"_lt"}: ${nextDay} }`;
        } else if (gqlOperator === "_gt") {
          // Greater or equal to the next day will give us all the timestampz that are greater than the selected date
          whereString = `${field}: { ${"_gte"}: ${nextDay} }`;
        }
      }
      return whereString;
    })
    .filter((value) => value !== null);

export const useAdvancedSearch = () => {
  /* Get advanced filters settings from search params if they exist */
  let [searchParams] = useSearchParams();
  const initialFilterState = useMakeFilterState({
    searchParams,
    advancedSearchFilterParamName,
  });

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
