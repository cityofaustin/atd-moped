import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { getSearchValue } from "src/utils/gridTableHelpers";

/* Name of simple search URL parameter */
export const simpleSearchParamName = "search";

export const useSearch = ({ queryConfig }) => {
  /* Get simple search from search params if it exists */
  let [searchParams] = useSearchParams();
  const simpleSearchValue = searchParams.get(simpleSearchParamName);

  const [searchTerm, setSearchTerm] = useState(simpleSearchValue ?? "");

  const searchWhereString = useMemo(() => {
    if (searchTerm && searchTerm.length > 0) {
      /**
       * Iterate through all column keys, if they are searchable
       * add the to the Or list.
       */
      const searchOperatorsAndValues = Object.keys(queryConfig.columns)
        .filter((column) => queryConfig.columns[column]?.searchable)
        .map((column) => {
          const { operator, quoted, envelope } =
            queryConfig.columns[column].search;
          const searchValue = getSearchValue(queryConfig, column, searchTerm);
          const graphqlSearchValue = quoted
            ? `"${envelope.replace("{VALUE}", searchValue)}"`
            : searchValue;

          return `{ ${column}: {${operator}: ${graphqlSearchValue}} }`;
        });

      return searchOperatorsAndValues.join(", ");
    } else {
      return null;
    }
  }, [searchTerm, queryConfig]);

  return {
    searchTerm,
    setSearchTerm,
    searchWhereString,
  };
};
