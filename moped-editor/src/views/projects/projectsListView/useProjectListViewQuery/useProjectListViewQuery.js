import { useMemo } from "react";
import { gql } from "apollo-boost";
import { usePagination } from "./usePagination";
import { useOrderBy } from "./useOrderBy";

export const useGetProjectListView = ({
  columnsToReturn,
  defaultSearchTerm,
}) => {
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

  const { searchTerm, setSearchTerm, searchWhereString } = useSearch({
    defaultSearchTerm,
  });

  // TODO: Add hook to get columns to query (columnsToReturn filtered by hidden: false)
  // TODO: Add hook for advanced filters

  const query = useMemo(() => {
    return gql`{
        project_list_view (
            limit: ${queryLimit}
            offset: ${queryOffset}
            order_by: {${orderByColumn}: ${orderByDirection}}
            where: {${searchWhereString}}
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
  };
};
