import { useMemo } from "react";
import { gql } from "apollo-boost";
import { usePagination } from "./usePagination";
import { useOrderBy } from "./useOrderBy";

export const useGetProjectListView = ({ columnsToReturn, queryConfig }) => {
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

  const query = useMemo(() => {
    return gql`{
        project_list_view (
            limit: ${queryLimit}
            offset: ${queryOffset}
            order_by: {${orderByColumn}: ${orderByDirection}}
        ) {
            ${columnsToReturn.join("\n")}
        },
        project_list_view_aggregate {
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
  };
};
