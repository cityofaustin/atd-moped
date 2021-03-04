import { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { ProjectActivityLogTableMaps } from "../views/projects/projectView/ProjectActivityLogTableMaps";

export const PLACEHOLDER_QUERY = gql`
  query NotARealQuery {
    just_a_placeholder {
      affected_rows
    }
  }
`;

/**
 * Takes an array of table names and uses ProjectActivityLogTableMaps to create a query for lookup tables
 * @param {array} tableNames - Names of table with field that requires a lookup
 * @return {query} A GraphQL query document parsed by gql.
 */
export const buildLookupQuery = tableNames => {
  const noLookupsObject = {
    areLookups: false,
    query: PLACEHOLDER_QUERY,
  };

  if (!tableNames || tableNames.length === 0) return noLookupsObject;

  const lookupQueries = tableNames.map(tableName => {
    const fields = ProjectActivityLogTableMaps[tableName].fields;

    const lookupFields = Object.entries(fields).reduce(
      (acc, [primaryFieldName, fieldConfig]) => {
        return fieldConfig.hasOwnProperty("lookup")
          ? [...acc, { ...fieldConfig.lookup, primaryFieldName }]
          : [...acc];
      },
      []
    );

    // We need the field name from the original table here
    const tableQueries = lookupFields.map(field => {
      const { table, fieldLabel, fieldValue, primaryFieldName } = field;

      // Alias table name as primary table field name and return foreign key and value
      return `
      ${primaryFieldName}: ${table} {
        key: ${fieldLabel}
        value: ${fieldValue}
      }
      `;
    });

    return tableQueries;
  });

  const flatLookupQueries = lookupQueries.flat();

  if (flatLookupQueries.length === 0) return noLookupsObject;

  const lookupQueriesString = flatLookupQueries.join(" ");

  const LOOKUPS_QUERY = gql`
    query RetrieveLookupValues { 
      ${lookupQueriesString} 
    }
  `;

  return { areLookups: true, query: LOOKUPS_QUERY };
};

/**
 * Take activity log response and return unique table names for lookup in project's log
 * @param {object} response - GraphQL response containing project record types (table names)
 * @return {array} Array of unique table names for log data lookups
 */
export const getActivityLogTableNames = response => {
  const lookupTableData = response?.activity_log_lookup_tables;

  if (!lookupTableData || lookupTableData.length === 0) return null;

  const tableNames = lookupTableData.map(record => record.record_type);

  return tableNames;
};

export function useActivityLogLookupTables() {
  const [lookupObject, setLookupObject] = useState({
    query: PLACEHOLDER_QUERY,
    areLookups: false,
  });

  const [lookupMap, setLookupMap] = useState(null);

  const getLookup = data => {
    const recordTableNames = getActivityLogTableNames(data);
    const { query, areLookups } = buildLookupQuery(recordTableNames);

    setLookupObject({ query, areLookups });
  };

  const createLookupMap = response => {
    const lookupMapFromResponse = Object.entries(response).reduce(
      (acc, [field, mapArray]) => {
        let fieldMap = {};
        mapArray.forEach(record => {
          fieldMap = { ...fieldMap, [record.key]: record.value };

          return { ...acc, [field]: fieldMap };
        });
        return { ...acc, [field]: fieldMap };
      },
      {}
    );
    // TODO Maybe we should include table name to avoid intersection of field names
    setLookupMap(lookupMapFromResponse);
  };

  const { lookupQueryLoading, lookupError } = useQuery(lookupObject.query, {
    skip: !lookupObject.areLookups,
    onCompleted: lookupResponse => createLookupMap(lookupResponse),
    fetchPolicy: "no-cache",
  });

  const lookupLoading = lookupQueryLoading;

  return { lookupLoading, lookupError, lookupMap, getLookup };
}
