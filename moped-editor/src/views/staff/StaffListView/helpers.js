import { useState, useEffect } from "react";
import { useUser } from "../../../auth/user";
import axios from "axios";

// Use local API dev server for now
export const LOCAL_URI = `http://127.0.0.1:5000`;

// Custom Hook for API calls
export function useApi(url) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, getToken } = useUser();

  const token = getToken(user);

  const headers = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    setLoading(true);
    axios.get(url, headers).then(res => {
      setResult(res.data);
      setLoading(false);
    });
  }, [url]);

  return [result, loading];
}
