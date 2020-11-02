import { useState, useEffect } from "react";
import { useUser } from "../../../auth/user";
import axios from "axios";

// Use local API dev server for now
export const LOCAL_URI = `http://127.0.0.1:5000`;

// Custom Hook for API calls
export function useApi(url, method, payload = null) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, getToken } = useUser();

  useEffect(() => {
    const token = getToken(user);

    const config = {
      url,
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    if (payload) {
      config = { ...config, data: payload };
    }
    console.log(url, method, config);

    setLoading(true);
    axios(config).then(res => {
      setResult(res.data);
      setLoading(false);
    });
  }, [url, getToken, user]);

  return [result, loading];
}
