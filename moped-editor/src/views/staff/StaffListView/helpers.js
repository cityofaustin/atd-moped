import { useState, useEffect } from "react";
import { useUser } from "../../../auth/user";
import axios from "axios";

// Custom Hook for API calls
export function useUserApi(method, path, payload = null) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, getToken } = useUser();

  useEffect(() => {
    // Use local API dev server for now
    const url = `http://127.0.0.1:5000` + path;

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
  }, [getToken, user]);

  return [result, loading];
}
