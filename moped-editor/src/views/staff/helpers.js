import { useState } from "react";
import { useUser } from "../../auth/user";
import axios from "axios";

// Custom Hook for API calls
export function useUserApi() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, getToken } = useUser();

  const requestApi = ({ method, path, payload, callback }) => {
    // Use local API dev server for now
    const url = process.env.REACT_APP_API_ENDPOINT + path;

    const token = getToken(user);

    let config = {
      url,
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    if (payload) {
      config = { ...config, data: payload };
    }

    setLoading(true);

    axios(config).then(res => {
      setResult(res.data);
      console.log(res);
      setLoading(false);
      !!callback && callback();
    });
  };

  return { result, loading, requestApi };
}
