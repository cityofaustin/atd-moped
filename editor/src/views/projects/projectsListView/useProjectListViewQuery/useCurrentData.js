import { useState, useMemo } from "react";

/**
 * Provide a constant stream of data from a useQuery hook to mask the loading state
 * @param {Object} data - response from Apollo useQuery
 * @returns {Object} - most current data from useQuery
 */
export const useCurrentData = (data) => {
  const [previousData, setPreviousData] = useState(null);

  const currentData = useMemo(() => {
    if (data) {
      setPreviousData(data);
      return data;
    } else {
      return previousData;
    }
  }, [data, setPreviousData, previousData]);

  return currentData;
};
