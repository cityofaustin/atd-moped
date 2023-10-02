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
  // TODO: Accept filters from URL as parameter (or handle in here?)
  // TODO: If handling in here, move custom hooks here
  // TODO: Accept config as parameter
  // TODO: Clear when advanced search is used. Search term stays in UI, but not in query
  const filterQuery = useFilterQuery(useLocation().search);
  const initialFilterState = useMakeFilterState(filterQuery);
  console.log(filterQuery);
  console.log(initialFilterState);

  // filterState
  /**
   * Stores objects storing a random id, column, operator, and value.
   * @type {Object} filters
   * @function setFilter - Sets the state of filters
   * @default {if filter in url, use those params, otherwise {}}
   */
  const [filters, setFilter] = useState(initialFilterState);

  // Advanced Search from ProjectListTable
  //    Object.keys(filters).forEach((filter) => {
  //     let { envelope, field, gqlOperator, value, type, specialNullValue } =
  //       filters[filter];

  //     // If we have no operator, then there is nothing we can do.
  //     if (field === null || gqlOperator === null) {
  //       return;
  //     }

  //     if (gqlOperator.includes("is_null")) {
  //       // Some fields when empty are not null but rather an empty string or "None"
  //       if (specialNullValue) {
  //         gqlOperator = envelope === "true" ? "_eq" : "_neq";
  //         value = specialNullValue;
  //       } else {
  //         value = envelope;
  //       }
  //     } else {
  //       if (value !== null) {
  //         // If there is an envelope, insert value in envelope.
  //         value = envelope ? envelope.replace("{VALUE}", value) : value;

  //         // If it is a number or boolean, it does not need quotation marks
  //         // Otherwise, add quotation marks for the query to identify as string
  //         value = type in ["number", "boolean"] ? value : `"${value}"`;
  //       } else {
  //         // We don't have a value
  //         return;
  //       }
  //     }
  //     query.setWhere(field, `${gqlOperator}: ${value}`);
  //   });

  //   const advancedSearchWhereString = useMemo(() => {
  // Build the the advanced search part of the query
  //   }, []);

  return {
    filterQuery,
    filters,
    setFilter,
  };
};

// {
//     project_list_view(
//       limit: 250
//       offset: 0
//       where: {type_name: {_ilike: "%PHB - Mod%"}, _or: [{project_id: {_eq: 0}}, {project_name: {_ilike: "%test%"}}, {project_description: {_ilike: "%test%"}}, {current_phase: {_ilike: "%test%"}}, {project_lead: {_ilike: "%test%"}}, {project_sponsor: {_ilike: "%test%"}}, {project_partner: {_ilike: "%test%"}}, {ecapris_subproject_id: {_ilike: "%test%"}}]}
//       order_by: {updated_at: desc}
//     ) {
//       project_id
//       project_name
//       project_description
//       current_phase
//       current_phase_key
//       project_team_members
//       project_lead
//       project_sponsor
//       project_partner
//       ecapris_subproject_id
//       updated_at
//       public_process_status
//       task_order
//       task_order_name
//       project_feature
//       type_name
//       funding_source_name
//       project_note
//       construction_start_date
//       completion_end_date
//       project_inspector
//       project_designer
//       contractors
//       contract_numbers
//       project_tags
//       added_by
//       interim_project_id
//       children_project_ids
//       parent_project_id
//       parent_project_name
//       __typename
//     }
//     project_list_view_aggregate(
//       where: {type_name: {_ilike: "%PHB - Mod%"}, _or: [{project_id: {_eq: 0}}, {project_name: {_ilike: "%test%"}}, {project_description: {_ilike: "%test%"}}, {current_phase: {_ilike: "%test%"}}, {project_lead: {_ilike: "%test%"}}, {project_sponsor: {_ilike: "%test%"}}, {project_partner: {_ilike: "%test%"}}, {ecapris_subproject_id: {_ilike: "%test%"}}]}
//       order_by: {updated_at: desc}
//     ) {
//       aggregate {
//         count
//         __typename
//       }
//       __typename
//     }
//   }

// Shape of filters from url:
// {
//     "9e00baa0-72a3-4804-ba03-79b984a28e42": {
//         "id": "9e00baa0-72a3-4804-ba03-79b984a28e42",
//         "field": "project_sponsor",
//         "operator": "string_contains_case_insensitive",
//         "availableOperators": [
//             {
//                 "operator": "_ilike",
//                 "label": "contains",
//                 "description": "String is contained in field (case-insensitive)",
//                 "envelope": "%{VALUE}%",
//                 "type": "string",
//                 "id": "string_contains_case_insensitive"
//             },
//             {
//                 "operator": "_ilike",
//                 "label": "begins with",
//                 "description": "Field content begins with string (case-insensitive)",
//                 "envelope": "{VALUE}%",
//                 "type": "string",
//                 "id": "string_begins_with_case_insensitive"
//             },
//             {
//                 "operator": "_ilike",
//                 "label": "ends with",
//                 "description": "Field content ends with string (case-insensitive)",
//                 "envelope": "%{VALUE}",
//                 "type": "string",
//                 "id": "string_ends_with_case_insensitive"
//             },
//             {
//                 "operator": "_ilike",
//                 "label": "is",
//                 "description": "Field content equals string (case-sensitive)",
//                 "envelope": null,
//                 "type": "string",
//                 "id": "string_equals_case_sensitive"
//             },
//             {
//                 "operator": "_neq",
//                 "label": "is not",
//                 "description": "Field content does not equal string (case-sensitive)",
//                 "envelope": null,
//                 "type": "string",
//                 "id": "string_does_not_equal_case_sensitive"
//             },
//             {
//                 "operator": "_is_null",
//                 "label": "is blank",
//                 "description": "Selected field does not have meaningful content",
//                 "envelope": "true",
//                 "specialNullValue": "\"None\"",
//                 "type": "string",
//                 "id": "string_is_null_special_case"
//             },
//             {
//                 "operator": "_is_null",
//                 "label": "is not blank",
//                 "description": "String field does not match special null value",
//                 "envelope": "false",
//                 "specialNullValue": "\"None\"",
//                 "type": "string",
//                 "id": "string_is_not_null_special_case"
//             }
//         ],
//         "gqlOperator": "_ilike",
//         "envelope": "%{VALUE}%",
//         "placeholder": "Project sponsor",
//         "value": "COA",
//         "type": "string",
//         "label": "Sponsor",
//         "lookup_table": "moped_entity",
//         "lookup_field": "entity_name"
//     }
// }
