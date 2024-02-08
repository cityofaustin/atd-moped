import { useMemo } from "react";
import { gql } from "apollo-boost";

export const useGetProjectListView = ({
  columnsToReturn,
  exportColumnsToReturn,
  queryLimit,
  queryOffset,
  orderByColumn,
  orderByDirection,
  searchWhereString,
  advancedSearchWhereString,
}) => {
  const { query, exportQuery } = useMemo(() => {
    const queryString = `query ProjectListView {
        project_list_view (
            limit: ${queryLimit}
            offset: ${queryOffset}
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

    const exportQueryString = gql`{
      project_list_view (
          order_by: {${orderByColumn}: ${orderByDirection}}
          where: { 
            ${advancedSearchWhereString ? advancedSearchWhereString : ""}
            ${searchWhereString ? `_or: [${searchWhereString}]` : ""} 
          }
      ) {
          ${exportColumnsToReturn.join("\n")}
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
    const exportQuery = gql`
      ${exportQueryString}
    `;

    return { query, exportQuery };
  }, [
    queryLimit,
    queryOffset,
    columnsToReturn,
    exportColumnsToReturn,
    orderByColumn,
    orderByDirection,
    searchWhereString,
    advancedSearchWhereString,
  ]);

  return {
    query,
    exportQuery,
  };
};
