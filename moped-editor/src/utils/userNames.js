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
  const name = getUserFullName(moped_user).trim();

  // If no names are available, return null to force the generic humanoid avatar
  if (name.length === 0 || name === unknownUserNameValue) return null;

  // Else, extract initials
  return name
    .replace(/[^A-Za-z0-9À-ÿ ]/gi, "")
    .replace(/ +/gi, " ")
    .split(/ /)
    .reduce((acc, item) => acc + item[0], "")
    .concat(name.substr(1))
    .concat(name)
    .substr(0, 2)
    .toUpperCase();
};
