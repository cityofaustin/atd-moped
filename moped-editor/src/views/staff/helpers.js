import { useState } from "react";
import { useUser } from "../../auth/user";
import axios from "axios";

// Custom Hook for API calls
export function useUserApi() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
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

    axios(config)
      .then(res => {
        setResult(res.data);
        setLoading(false);
        !!callback && callback();
      })
      .catch(err => {
        setError(err.response.data.error);
      });
  };

  return { result, error, loading, requestApi };
}

const errorsToTranslate = {
  "value does not match regex '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$'":
    "not a valid email format",
  "value does not match regex '^[a-zA-Z0-9_-!@%^*~?.:&*()[]$]*$'":
    "password must only contain: a-z, A-Z, 0-9, and any of these special characters: _-!@%^~?.:&()[]$",
};

export const formatApiErrors = errorsArray =>
  errorsArray
    ? errorsArray.map(error => errorsToTranslate[error] || error).join(", ")
    : false;
