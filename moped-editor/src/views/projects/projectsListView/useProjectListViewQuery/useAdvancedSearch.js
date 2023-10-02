import { useState, useMemo } from "react";

export const useAdvancedSearch = ({ queryConfig, defaultSearchTerm }) => {
  const [searchTerm, setSearchTerm] = useState(defaultSearchTerm ?? "");

  // searchState
  /**
   * Stores the string to search for and the column to search against
   * @type {Object} search
   * @property {string} value - The string to be searched for
   * @property {string} column - The name of the column to search against
   * @function setSearch - Sets the state of search
   * @default {{value: "", column: ""}}
   */
  //   const [search, setSearch] = useState({
  //     value: navSearchTerm ?? "",
  //     column: "",
  //   });

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

  const advancedSearchWhereString = useMemo(() => {
    // Build the the advanced search part of the query
  }, [searchTerm, queryConfig]);

  return {
    searchTerm,
    setSearchTerm,
    searchWhereString,
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
