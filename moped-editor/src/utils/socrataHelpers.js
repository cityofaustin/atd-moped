import { useEffect, useState } from "react";

  /**
 * Fetch data from a socrata endpoint. Actually will fetch from any JSON endpoint, but has
 *  a special error catch for Socrata API errors.
 * @param {String} url - The url endpoint
 * @return {Object} data, loading, and error states
 */
export const useSocrata = url => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(
        result => {
          if (result.error) {
            // on query error, socrata returns status 200 with {"error": true, "message": <message>} in body
            setError(result.message.toString());
          } else {
            // insert an empty option for the initialized (empty) state this creates a weird
            // blank list option in the autocomplete menu. i have not found an alternative
            // that avoids material linter errors
            result.features.push("");
            setData(result.features);
          }
        },
        error => {
          setError(error.toString());
        }
      );
  }, [url]);

  error && console.error(error);

  return { data, error, loading: !data && !error };
};
