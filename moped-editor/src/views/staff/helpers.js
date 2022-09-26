import { useState } from "react";
import { useUser, getJwt } from "../../auth/user";
import axios from "axios";

/**
 * Custom hook to handle requests to routes of the Moped API
 * @returns {Function} requestApi - Function to call the API
 * @returns {Object} result - The result object of the request
 * @returns {Object} error - Error object containing errors returned from the API
 * @returns {Function} setError - Set error state
 * @returns {Boolean} loading - Loading state
 * @returns {Function} setLoading - Set loading state
 */
export function useUserApi() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  /**
   * Call the User route of the Moped API
   * @param {String} method - HTTP methods supported by Axios
   * @param {String} path - Path of the route in the Moped API
   * @param {Object} payload - Data sent to Moped API
   * @param {Function} callback - Callback that fires on request success
   */
  const requestApi = ({ method, path, payload, callback }) => {
    const url = process.env.REACT_APP_API_ENDPOINT + path;

    const jwt = getJwt(user);

    let config = {
      url,
      method,
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    };

    if (payload) {
      config = { ...config, data: payload };
    }

    setLoading(true);

    axios(config)
      .then((res) => {
        setResult(res.data);
        setError(null); // Clear errors from previous attempts
        setLoading(false);
        !!callback && callback();
      })
      .catch((err) => {
        const otherError = err?.response?.data?.message
          ? {
              error: {
                other: [err?.response?.data?.message],
              },
            }
          : null;
        setError(err?.response?.data?.error ?? otherError);
      });
  };

  return { result, error, setError, loading, setLoading, requestApi };
}

const errorsToTranslate = {
  "value does not match regex '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$'":
    "not a valid email format",
  "value does not match regex '^[a-zA-Z0-9_-!@%^*~?.:&*()[]$]*$'":
    "password must be at least 12 characters long, it must include at least one lowercase letter, one uppercase letter, one number, and one special character: _-!@%^~?.:&()[]$",
};

export const formatApiErrors = (errorsArray) =>
  errorsArray
    ? errorsArray.map((error) => errorsToTranslate[error] || error).join(", ")
    : null;

/**
 * Makes sure the password looks ok
 * @returns {boolean}
 */
export const passwordLooksGood = (password) =>
  new RegExp(
    "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{12,}$"
  ).test(password);

/**
 * Makes sure a role has been selected
 * @returns {boolean}
 */
export const roleLooksGood = (roles) =>
  ["moped-viewer", "moped-editor", "moped-admin", nonLoginUserRole].includes(
    roles
  );

/**
 * Functions to transform form outputs into the type the DB expects
 */
export const fieldParsers = {
  workgroup_id: (id) => parseInt(id),
  roles: (role) => [role],
};

/**
 * Transforms form data output into types expected by the database
 * @param {Object} formData - The form data output
 * @returns {Object} The formatted form data
 */
export const transformFormDataIntoDatabaseTypes = (formData) => {
  const databaseData = { ...formData };

  Object.entries(fieldParsers).forEach(([fieldName, parser]) => {
    const originalValue = databaseData[fieldName];
    const parsedValue = parser(originalValue);

    databaseData[fieldName] = parsedValue;
  });

  return databaseData;
};

export const nonLoginUserRole = "non-login-user";

/**
 * Determine if the user is a non-login user (true) or Moped user (false)
 * @param {Array} roles - roles assigned to the user
 * @returns {boolean} Whether the user is a non-login user
 */
export const isUserNonLoginUser = (roles) => {
  if (roles === undefined || roles === null) return false;

  return roles.includes(nonLoginUserRole);
};
