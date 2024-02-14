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
  const { query } = useMemo(() => {
    const queryString = `query ProjectListView {
        project_list_view (
            limit: ${queryLimit}
            offset: ${queryOffset}
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
    queryLimit,
    queryOffset,
    columnsToReturn,
    orderByColumn,
    orderByDirection,
    searchWhereString,
    advancedSearchWhereString,
  ]);
  const { exportQuery } = useMemo(() => {
    const exportQueryString = gql`query ProjectListExport {
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

    return { exportQuery };
  }, [
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
