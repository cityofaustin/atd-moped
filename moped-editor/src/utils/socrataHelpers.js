import { useEffect, useState } from "react";

/**
 * Fetches data from a socrata geojson endpoint
 * @param {String} url - The url endpoint
 * @return {Object} data (geojson feature array), loading, and error states
 */
export const useSocrataGeojson = url => {
  const [features, setFeatures] = useState(null);
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
            // result is a geojson feature collection
            setFeatures(result.features);
          }
        },
        error => {
          setError(error.toString());
        }
      );
  }, [url]);

  error && console.error(error);

  return { features, error, loading: !features && !error };
};
