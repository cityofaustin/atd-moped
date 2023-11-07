import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * if filter exists in url, decodes base64 string and returns as object
 * Used to initialize filter state
 * @return Object
 */
const useMakeFilterState = (searchParams) =>
  useMemo(() => {
    if (Array.from(searchParams).length > 0) {
      try {
        return JSON.parse(atob(searchParams.get("filter")));
      } catch {
        return {};
      }
    }
    return {};
  }, [searchParams]);

/**
 * Build an array of filter strings to be used in generating the advanced search where string
 @ param {Object} filters - Stores filters assigned random id and nests column, operator, and value
 * @return Object
 */
const makeAdvancedSearchWhereFilters = (filters) =>
  Object.keys(filters)
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
    .filter((value) => value !== null);

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

// query ProjectListView {
//   project_list_view(
//     limit: 100
//     offset: 0
//     order_by: {updated_at: desc}
//     where: {_and: [{project_team_members: {_ilike: "%cecily%"}}, {project_team_members: {_ilike: "%nathan%"}}]}
//   ) {
//     project_id
//     project_name
//     project_description
//     current_phase
//     current_phase_key
//     project_team_members
//     project_lead
//     project_sponsor
//     project_partner
//     ecapris_subproject_id
//     updated_at
//     public_process_status
//     task_orders
//     task_order_names
//     project_feature
//     type_name
//     funding_source_name
//     project_note
//     construction_start_date
//     completion_end_date
//     project_inspector
//     project_designer
//     contractors
//     contract_numbers
//     project_tags
//     added_by
//     interim_project_id
//     children_project_ids
//     parent_project_id
//     parent_project_name
//     __typename
//   }
//   project_list_view_aggregate(
//     where: {_and: [{project_team_members: {_ilike: "%cecily%"}}, {project_team_members: {_ilike: "%nathan%"}}]}
//   ) {
//     aggregate {
//       count
//       __typename
//     }
//     __typename
//   }
// }
