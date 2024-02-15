import { useMemo } from "react";
import { gql } from "apollo-boost";

export const useGetProjectListView = ({
  columnsToReturn,
  queryLimit,
  queryOffset,
  orderByColumn,
  orderByDirection,
  searchWhereString,
  advancedSearchWhereString,
  queryName,
}) => {
  const { query } = useMemo(() => {
    const queryString = `query ${queryName} {
      project_list_view (
          ${queryLimit ? `limit: ${queryLimit}` : ""}
          ${queryOffset ? `offset: ${queryOffset}` : ""}
          order_by: {${orderByColumn}: ${orderByDirection}}
          where: { 
            ${advancedSearchWhereString ? advancedSearchWhereString : ""}
            ${searchWhereString ? `_or: [${searchWhereString}]` : ""} 
          }
      ) {
          ${columnsToReturn.join("\n")}
      },
      project_list_view_aggregate (
        where: { 
          ${advancedSearchWhereString ? advancedSearchWhereString : ""}
          ${searchWhereString ? `_or: [${searchWhereString}]` : ""} 
        }
      ) {
        aggregate {
          count
        }
      }
    }`;
    const query = gql`
      ${queryString}
    `;

    return { query };
  }, [
    columnsToReturn,
    queryLimit,
    queryOffset,
    orderByColumn,
    orderByDirection,
    searchWhereString,
    advancedSearchWhereString,
    queryName,
  ]);

  return {
    query,
  };
};
