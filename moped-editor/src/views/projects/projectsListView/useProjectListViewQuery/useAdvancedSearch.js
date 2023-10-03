import { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";

const useFilterQuery = (locationSearch) =>
  useMemo(() => {
    return new URLSearchParams(locationSearch);
  }, [locationSearch]);

/**
 * if filter exists in url, decodes base64 string and returns as object
 * Used to initialize filter state
 * @return Object
 */
const useMakeFilterState = (filterQuery) =>
  useMemo(() => {
    if (Array.from(filterQuery).length > 0) {
      try {
        return JSON.parse(atob(filterQuery.get("filter")));
      } catch {
        return {};
      }
    }
    return {};
  }, [filterQuery]);

export const useAdvancedSearch = () => {
  // TODO: Clear when advanced search is used. Search term stays in UI, but not in query
  const filterQuery = useFilterQuery(useLocation().search);
  const initialFilterState = useMakeFilterState(filterQuery);

  // filterState
  /**
   * Stores objects storing a random id, column, operator, and value.
   * @type {Object} filters
   * @function setFilter - Sets the state of filters
   * @default {if filter in url, use those params, otherwise {}}
   */
  const [filters, setFilters] = useState(initialFilterState);

  // Advanced Search from ProjectListTable

  const advancedSearchWhereString = useMemo(() => {
    //   Build the the advanced search part of the query
    return Object.keys(filters)
      .map((filter) => {
        let { envelope, field, gqlOperator, value, type, specialNullValue } =
          filters[filter];

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
      .filter((value) => value !== null)
      .join(", ");
  }, [filters]);

  return {
    filterQuery,
    filters,
    setFilters,
    advancedSearchWhereString,
  };
};
