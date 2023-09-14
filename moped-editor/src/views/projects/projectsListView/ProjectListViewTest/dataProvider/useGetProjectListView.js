const useGetProjectListView = () => {
  // manage query
  const { data, loading, error } = useQuery(
    query.gql,
    query.config.options.useQuery
  );

  // build pagination
  // limit, offset, page
};
