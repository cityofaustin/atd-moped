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
  const query = useMemo(() => {
    const queryString = `query ${queryName} {
      project_list_view (
          ${queryLimit ? `limit: ${queryLimit}` : ""}
          ${queryOffset ? `offset: ${queryOffset}` : ""}
          order_by: {${orderByColumn}: ${orderByDirection}}
          where: { 
            ${
              searchWhereString && advancedSearchWhereString
                ? `_and: [{_or: [${searchWhereString}]}, {${advancedSearchWhereString}}]`
                : ""
            }
            ${
              searchWhereString && !advancedSearchWhereString
                ? `_or: [${searchWhereString}]`
                : ""
            }
            ${
              advancedSearchWhereString && !searchWhereString
                ? advancedSearchWhereString
                : ""
            }
          }
      ) {
          ${columnsToReturn.join("\n")}
      },
      project_list_view_aggregate (
        where: { 
          ${
            searchWhereString && advancedSearchWhereString
              ? `_and: [{_or: [${searchWhereString}]}, {${advancedSearchWhereString}}]`
              : ""
          }
          ${
            searchWhereString && !advancedSearchWhereString
              ? `_or: [${searchWhereString}]`
              : ""
          }
          ${
            advancedSearchWhereString && !searchWhereString
              ? advancedSearchWhereString
              : ""
          }
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

    return query;
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
