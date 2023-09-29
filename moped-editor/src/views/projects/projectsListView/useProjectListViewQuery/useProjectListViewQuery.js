import { useMemo } from "react";
import { gql } from "apollo-boost";
import { usePagination } from "./usePagination";
import { useOrderBy } from "./useOrderBy";
import { useSearch } from "./useSearch";

export const useGetProjectListView = ({
  columnsToReturn,
  defaultSearchTerm,
  queryConfig,
}) => {
  const { queryLimit, setQueryLimit, queryOffset, setQueryOffset } =
    usePagination({
      defaultLimit: queryConfig.pagination.defaultLimit,
      defaultOffset: queryConfig.pagination.defaultOffset,
    });

  const {
    orderByColumn,
    setOrderByColumn,
    orderByDirection,
    setOrderByDirection,
  } = useOrderBy({
    defaultOrderByColumn: queryConfig.order.defaultOrderByColumn,
    defaultOrderByDirection: queryConfig.order.defaultOrderByDirection,
  });

  const { searchTerm, setSearchTerm, searchWhereString } = useSearch({
    queryConfig,
    defaultSearchTerm,
  });

  const query = useMemo(() => {
    return gql`{
        project_list_view (
            limit: ${queryLimit}
            offset: ${queryOffset}
            order_by: {${orderByColumn}: ${orderByDirection}}
            where: { ${searchWhereString ? `_or: [${searchWhereString}]` : ""} }
        ) {
            ${columnsToReturn.join("\n")}
        },
        project_list_view_aggregate (
          where: { ${searchWhereString ? `_or: [${searchWhereString}]` : ""} }
        ) {
          aggregate {
            count
          }
        }
      }`;
  }, [
    queryLimit,
    queryOffset,
    columnsToReturn,
    orderByColumn,
    orderByDirection,
    searchWhereString,
  ]);

  return {
    query,
    setQueryLimit,
    setQueryOffset,
    queryLimit,
    queryOffset,
    orderByColumn,
    setOrderByColumn,
    orderByDirection,
    setOrderByDirection,
    searchTerm,
    setSearchTerm,
  };
};
