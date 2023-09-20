import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import { gql } from "apollo-boost";
import { usePagination } from "./usePagination";

// TODO: We could add a table parameter to this function to allow for different tables to be queried
export const useGetProjectListView = ({ columnsToReturn }) => {
  const { queryLimit, setQueryLimit, queryOffset, setQueryOffset } =
    usePagination();

  // TODO: Add hook to get columns to query (columnsToReturn filtered by hidden: false)
  // TODO: Add hook for order
  // TODO: Add hook for where filters

  const query = useMemo(() => {
    return gql`{
        project_list_view (
            limit: ${queryLimit}
            offset: ${queryOffset}
        ) {
            ${columnsToReturn.join("\n")}
        },
        project_list_view_aggregate {
          aggregate {
            count
          }
        }
      }`;
  }, [queryLimit, queryOffset, columnsToReturn]);

  const { data, loading, error } = useQuery(query, {
    fetchPolicy: "cache-first",
  });

  return {
    data,
    loading,
    error,
    setQueryLimit,
    setQueryOffset,
    queryLimit,
    queryOffset,
  };
};

// This is what comes out of the current query using gqlabstract
// This is what we need to build the query
// {
//     project_list_view(
//       limit: 250 ✅
//       offset: 0 ✅
//       where: {}
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
//       __typename
//     }
//     project_list_view_aggregate(where: {}, order_by: {updated_at: desc}) {
//       aggregate {
//         count
//         __typename
//       }
//       __typename
//     }
//   }
