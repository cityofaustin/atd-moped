// Fallback value for user without name set
export const unknownUserNameValue = "Unknown User";

/**
 * Retrieve the user's full name or return a fallback value
 * @param {object} moped_user - The user object from Hasura or Local Storage
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
 * Safely returns the initials from a user object
 * @param {object} moped_user - The user object from Hasura or Local Storage
 * @return {string}
 */
export const getInitials = moped_user => {
  const firstInitial = moped_user?.first_name?.[0];
  const lastInitial = moped_user?.last_name?.[0];
  const initials = `${firstInitial}${lastInitial}`;

  return firstInitial && lastInitial ? initials : null;
};
