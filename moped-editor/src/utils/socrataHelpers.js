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
          if (result.message) {
            // on query error, socrata returns status 200 with {"message": <message>} in body
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

/**
 * Fetches data from a socrata json endpoint
 * @param {String} url - The url endpoint
 * @return {Object} data (json object), loading, and error states
 */
export const useSocrataJson = url => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(
        result => {
          if (result.message) {
            // on query error, socrata returns status 200 with {"message": <message>} in body
            setError(result.message.toString());
          } else {
            // result is a json object
            setData(result);
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
