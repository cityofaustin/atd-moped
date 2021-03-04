import { useState } from "react";
import { useQuery } from "@apollo/client";
import {
  getActivityLogTableNames,
  buildLookupQuery,
  PLACEHOLDER_QUERY,
} from "../views/projects/projectView/ProjectActivityLogTableMaps";

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
