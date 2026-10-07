import type { Location } from "react-router";

const KEY = "moped_return_to";

/** Paths that should not be stored as return-to locations like the logout page
 * which would immediately log the user out after signing in.
 */
const EXCLUDED_PATHS = ["/moped/logout"];

/** Remember where the user was headed before being sent to sign-in unless it
 * is an excluded path. Uses sessionStorage so tabs can have their own return-to
 * paths, will not read/write across tabs, and still survive the SSO redirect.
 */
export const setReturnTo = (location: Location) => {
  if (EXCLUDED_PATHS.includes(location.pathname)) {
    return;
  }
  sessionStorage.setItem(
    KEY,
    location.pathname + location.search + location.hash
  );
};

/** Read and clear the stored path. Returns null if nothing was stored. */
export const takeReturnTo = () => {
  const value = sessionStorage.getItem(KEY);
  sessionStorage.removeItem(KEY);
  return value;
};
