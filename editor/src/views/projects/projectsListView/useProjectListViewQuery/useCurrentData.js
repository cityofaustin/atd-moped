import { useEffect, useState } from "react";

/**
 * Provide a constant stream of data from a useQuery hook to mask the loading state
 * @param {Object} data - response from Apollo useQuery
 * @returns {Object} - most current data from useQuery
 */
export const useCurrentData = (data) => {
  const [previousData, setPreviousData] = useState(null);

  useEffect(() => {
    if (data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- caches previous query data
      setPreviousData(data);
    }
  }, [data]);

  return data ?? previousData;
};
