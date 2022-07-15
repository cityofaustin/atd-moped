// export const getInitials = (name = "") =>
//   name
//     .replace(/\s+/, " ")
//     .split(" ")
//     .slice(0, 2)
//     .map(v => v && v[0].toUpperCase())
//     .join("");
// Fallback value for user without name set
const unknownUserNameValue = "Unknown User";

/**
 * Retrieve the user's full name or return an "N/A"
 * @param {object} moped_user - The user object as provided by hasura
 * @return {string}
 */
export const getUserFullName = moped_user => {
  const firstName = moped_user?.first_name ?? "";
  const lastName = moped_user?.last_name ?? "";
  if (firstName.length === 0 && firstName.length === 0)
    return unknownUserNameValue;
  return `${firstName} ${lastName}`;
};

/**
 * Safely returns the initials from a full name
 * @param {object} moped_user - The full name of the user
 * @return {string}
 */
export const getInitials = moped_user => {
  // Get any names if available
  const firstInitial = moped_user?.first_name[0];
  const lastInitial = moped_user?.last_name[0];
  const initials = `${firstInitial}${lastInitial}`;

  return firstInitial && lastInitial ? initials : null;
};
