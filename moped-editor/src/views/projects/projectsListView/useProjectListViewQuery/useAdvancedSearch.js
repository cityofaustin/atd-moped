import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { PROJECT_LIST_VIEW_FILTERS_CONFIG } from "../ProjectsListViewFiltersConf";
import { FiltersCommonOperators } from "src/components/GridTable/FiltersCommonOperators";

/**
 * if filter exists in url, decodes base64 string and returns as object
 * Used to initialize filter state
 * @return Object
 */
const useMakeFilterState = (searchParams) =>
  useMemo(() => {
    if (Array.from(searchParams).length > 0) {
      try {
        return JSON.parse(searchParams.get("filter"));
      } catch {
        return {};
      }
    }
    return {};
  }, [searchParams]);

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

export const makeSearchParamsFromFilterParameters = (filterParameters) => {
  return Object.values(filterParameters).map((filterParameter) => ({
    field: filterParameter.field,
    operator: filterParameter.operator,
    value: filterParameter.value,
  }));
};

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

// TODO: Just need field, operator, value to make filters
// Decoded react-admin example
// https://marmelab.com/react-admin-helpdesk/#/tickets?displayedFilters={}&filter={"customer_id":"ccb36ea0-92eb-49a2-93e2-2d23e0f74f04","product_id":"add57351-1e7c-4391-af42-298c6a3b70bd"}&order=DESC&page=1&perPage=25&sort=updated_at
// Encoded react-admin example
// https%3A%2F%2Fmarmelab.com%2Freact-admin-helpdesk%2F%23%2Ftickets%3FdisplayedFilters%3D%7B%7D%26filter%3D%7B%22customer_id%22%3A%22ccb36ea0-92eb-49a2-93e2-2d23e0f74f04%22%2C%22product_id%22%3A%22add57351-1e7c-4391-af42-298c6a3b70bd%22%7D%26order%3DDESC%26page%3D1%26perPage%3D25%26sort%3Dupdated_at
// Decoded example
// https://moped.austinmobility.io/moped/projects?filters=[{"column":"team_members","operator":"string_contains_case_insensitive","value":"chris"}]&isOr=false
// Encoded example
// https://moped.austinmobility.io/moped/projects?filters%3D%5B%7B%22column%22%3A%22team_members%22%2C%22operator%22%3A%22string_contains_case_insensitive%22%2C%22value%22%3A%22chris%22%7D%5D%26isOr%3Dfalse
// Current example
// https://moped.austinmobility.io/moped/projects?filter=eyJkYmY0YjIwNS1mZTFlLTRhMzktOTNlZS1jMzM4ZDRhYzc5NWYiOnsiaWQiOiJkYmY0YjIwNS1mZTFlLTRhMzktOTNlZS1jMzM4ZDRhYzc5NWYiLCJmaWVsZCI6InByb2plY3RfbGVhZCIsIm9wZXJhdG9yIjoic3RyaW5nX2NvbnRhaW5zX2Nhc2VfaW5zZW5zaXRpdmUiLCJhdmFpbGFibGVPcGVyYXRvcnMiOlt7Im9wZXJhdG9yIjoiX2lsaWtlIiwibGFiZWwiOiJjb250YWlucyIsImRlc2NyaXB0aW9uIjoiU3RyaW5nIGlzIGNvbnRhaW5lZCBpbiBmaWVsZCAoY2FzZS1pbnNlbnNpdGl2ZSkiLCJlbnZlbG9wZSI6IiV7VkFMVUV9JSIsInR5cGUiOiJzdHJpbmciLCJpZCI6InN0cmluZ19jb250YWluc19jYXNlX2luc2Vuc2l0aXZlIn0seyJvcGVyYXRvciI6Il9pbGlrZSIsImxhYmVsIjoiYmVnaW5zIHdpdGgiLCJkZXNjcmlwdGlvbiI6IkZpZWxkIGNvbnRlbnQgYmVnaW5zIHdpdGggc3RyaW5nIChjYXNlLWluc2Vuc2l0aXZlKSIsImVudmVsb3BlIjoie1ZBTFVFfSUiLCJ0eXBlIjoic3RyaW5nIiwiaWQiOiJzdHJpbmdfYmVnaW5zX3dpdGhfY2FzZV9pbnNlbnNpdGl2ZSJ9LHsib3BlcmF0b3IiOiJfaWxpa2UiLCJsYWJlbCI6ImVuZHMgd2l0aCIsImRlc2NyaXB0aW9uIjoiRmllbGQgY29udGVudCBlbmRzIHdpdGggc3RyaW5nIChjYXNlLWluc2Vuc2l0aXZlKSIsImVudmVsb3BlIjoiJXtWQUxVRX0iLCJ0eXBlIjoic3RyaW5nIiwiaWQiOiJzdHJpbmdfZW5kc193aXRoX2Nhc2VfaW5zZW5zaXRpdmUifSx7Im9wZXJhdG9yIjoiX2lsaWtlIiwibGFiZWwiOiJpcyIsImRlc2NyaXB0aW9uIjoiRmllbGQgY29udGVudCBlcXVhbHMgc3RyaW5nIChjYXNlLXNlbnNpdGl2ZSkiLCJlbnZlbG9wZSI6bnVsbCwidHlwZSI6InN0cmluZyIsImlkIjoic3RyaW5nX2VxdWFsc19jYXNlX3NlbnNpdGl2ZSJ9LHsib3BlcmF0b3IiOiJfbmVxIiwibGFiZWwiOiJpcyBub3QiLCJkZXNjcmlwdGlvbiI6IkZpZWxkIGNvbnRlbnQgZG9lcyBub3QgZXF1YWwgc3RyaW5nIChjYXNlLXNlbnNpdGl2ZSkiLCJlbnZlbG9wZSI6bnVsbCwidHlwZSI6InN0cmluZyIsImlkIjoic3RyaW5nX2RvZXNfbm90X2VxdWFsX2Nhc2Vfc2Vuc2l0aXZlIn0seyJvcGVyYXRvciI6Il9pc19udWxsIiwibGFiZWwiOiJpcyBibGFuayIsImRlc2NyaXB0aW9uIjoiU2VsZWN0ZWQgZmllbGQgZG9lcyBub3QgaGF2ZSBtZWFuaW5nZnVsIGNvbnRlbnQiLCJlbnZlbG9wZSI6InRydWUiLCJzcGVjaWFsTnVsbFZhbHVlIjoiXCJOb25lXCIiLCJ0eXBlIjoic3RyaW5nIiwiaWQiOiJzdHJpbmdfaXNfbnVsbF9zcGVjaWFsX2Nhc2UifSx7Im9wZXJhdG9yIjoiX2lzX251bGwiLCJsYWJlbCI6ImlzIG5vdCBibGFuayIsImRlc2NyaXB0aW9uIjoiU3RyaW5nIGZpZWxkIGRvZXMgbm90IG1hdGNoIHNwZWNpYWwgbnVsbCB2YWx1ZSIsImVudmVsb3BlIjoiZmFsc2UiLCJzcGVjaWFsTnVsbFZhbHVlIjoiXCJOb25lXCIiLCJ0eXBlIjoic3RyaW5nIiwiaWQiOiJzdHJpbmdfaXNfbm90X251bGxfc3BlY2lhbF9jYXNlIn1dLCJwbGFjZWhvbGRlciI6IlByb2plY3QgbGVhZCIsImxhYmVsIjoiTGVhZCIsInZhbHVlIjoiYXJ0ZXJpYWwiLCJsb29rdXBfdGFibGUiOiJtb3BlZF9lbnRpdHkiLCJsb29rdXBfZmllbGQiOiJlbnRpdHlfbmFtZSJ9fQ%3D%3D&isOr=false

export const useAdvancedSearch = () => {
  /* Get advanced filters settings from search params if they exist */
  let [searchParams] = useSearchParams();
  const initialFilterState = useMakeFilterState(searchParams);

  /* Determine or/any from search params if it exists */
  const isOrFromSearchParams = searchParams.get("isOr");
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
