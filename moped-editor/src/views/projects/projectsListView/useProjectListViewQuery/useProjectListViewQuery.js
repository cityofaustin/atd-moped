import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import { gql } from "apollo-boost";
import { usePagination } from "./usePagination";
import { useOrderBy } from "./useOrderBy";

export const useGetProjectListView = ({ columnsToReturn }) => {
  const { queryLimit, setQueryLimit, queryOffset, setQueryOffset } =
    usePagination({ defaultLimit: 250, defaultOffset: 0 });

  const {
    orderByColumn,
    setOrderByColumn,
    orderByDirection,
    setOrderByDirection,
  } = useOrderBy({
    defaultOrderByColumn: "updated_at",
    defaultOrderByDirection: "desc",
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
