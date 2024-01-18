import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

/* Name of simple search URL parameter */
export const simpleSearchParamName = "search";

/**
 * Attempts to retrieve a valid graphql search value, for example when searching on an
 * integer/float field but providing it a string, this function returns the value configured
 * in the invalidValueDefault field in the search object, or null.
 * @param {string} column - The name of the column to search
 * @param {*} value - The value in question
 * @returns {*} - The value output
 */
export const getSearchValue = (column, value, queryConfig) => {
  // Retrieve the type of field (string, float, int, etc)
  const type = queryConfig.columns[column].type.toLowerCase();
  // Get the invalidValueDefault in the search config object
  const invalidValueDefault =
    queryConfig.columns[column].search?.invalidValueDefault ?? null;
  // If the type is number of float, attempt to parse as such
  if (["number", "float", "double"].includes(type)) {
    value = Number.parseFloat(value) || invalidValueDefault;
  }
  // If integer, attempt to parse as integer
  if (["int", "integer"].includes(type)) {
    value = Number.parseInt(value) || invalidValueDefault;
  }
  // Any other value types are pass-through for now
  return value;
};

export const useSearch = ({ queryConfig }) => {
  /* Get simple search from search params if it exists */
  let [searchParams] = useSearchParams();
  const simpleSearchValue = searchParams.get(simpleSearchParamName);

  const [searchTerm, setSearchTerm] = useState(simpleSearchValue ?? "");

  const searchWhereString = useMemo(() => {
    if (searchTerm && searchTerm !== "") {
      /**
       * Iterate through all column keys, if they are searchable
       * add the to the Or list.
       */
      const searchOperatorsAndValues = Object.keys(queryConfig.columns)
        .filter((column) => queryConfig.columns[column]?.searchable)
        .map((column) => {
          const { operator, quoted, envelope } =
            queryConfig.columns[column].search;
          const searchValue = getSearchValue(column, searchTerm, queryConfig);
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
