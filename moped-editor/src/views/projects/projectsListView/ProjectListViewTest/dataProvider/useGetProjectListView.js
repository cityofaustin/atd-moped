const useGetProjectListView = ({
  tableName,
  pagination: { limit, offset, page },
}) => {
  // manage query
  const { data, loading, error } = useQuery(query.gql, {
    fetchPolicy: "cache-first",
  });

  // build pagination
  // limit, offset, page
  const queryTemplate = `{
    ${tableName} (
        gqlAbstractFilters
    ) {
        gqlAbstractColumns
    },
    gqlAbstractTableAggregateName (
        gqlAbstractAggregateFilters
    ) {
      aggregate {
        count
      }
    }
  }`;

  return {
    data,
    loading,
    error,
  };
};
