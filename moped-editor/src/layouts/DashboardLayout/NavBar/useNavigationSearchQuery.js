import { useMemo } from "react";
import { gql } from "apollo-boost";
import { NAVIGATION_SEARCH_QUERY_CONFIG } from "./NavigationSearchQueryConf";
import { getSearchValue } from "src/utils/gridTableHelpers";

export const useNavigationSearch = ({ searchTerm }) => {
  const columnsToReturn = Object.keys(NAVIGATION_SEARCH_QUERY_CONFIG.columns);
  const query = useMemo(() => {
    const searchOperatorsOrValues = searchTerm
      ? columnsToReturn.map((column) => {
          const { operator, quoted, envelope } =
            NAVIGATION_SEARCH_QUERY_CONFIG.columns[column].search;
          const searchValue = getSearchValue(
            NAVIGATION_SEARCH_QUERY_CONFIG,
            column,
            searchTerm
          );
          const graphqlSearchValue = quoted
            ? `"${envelope.replace("{VALUE}", searchValue)}"`
            : searchValue;

          return `{ ${column}: {${operator}: ${graphqlSearchValue}} }`;
        })
      : [];
    const searchWhereString = searchOperatorsOrValues.join(", ");
    const queryString = `query NavigationProjectsList {
      project_list_view (
          limit: 10
          order_by: { updated_at: desc },
          where: { 
            ${`_or: [${searchWhereString}]`}
          }
      ) {
          ${columnsToReturn.join("\n")}
      },
    }`;
    const query = gql`
      ${queryString}
    `;

    return query;
  }, [columnsToReturn, searchTerm]);

  return {
    query,
  };
};
