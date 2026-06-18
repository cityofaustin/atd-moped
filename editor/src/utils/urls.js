import * as yup from "yup";

/**
 * Validate a url using yup
 * @see https://github.com/jquense/yup/blob/1086aa93fdd08a554936a409c30788058dbc7c32/src/string.ts#L24-L26
 * @param {string} url - url to validate
 * @returns {Boolean} is the url valid?
 */
export const isValidUrl = (url) => {
  return yup.string().url().isValidSync(url);
};

/**
 * Converts a record key (e.g. moped_phases) into a URL hash (e.g. #moped-phases)
 * @param {string} recordKey - underscore-delimited record key
 * @returns {string} - hash string for use in URLs
 */
export const createRecordKeyHash = (recordKey) =>
  `#${recordKey.replaceAll("_", "-")}`;

/**
 * Attempt to make a url valid by prepending https:// to it
 * @param {string} url - url to try to make valid
 * @returns {string} - valid url or original url
 */
export const makeUrlValid = (url) => {
  if (url === null || url === "") return url;

  if (isValidUrl(`https://${url}`)) {
    return `https://${url}`;
  }

  return url;
};

// includes the error.message as the text in field 400 ("Describe the problem")
// and the email of the user logged in in field 406
export const createBugReportLink = (error, userEmail) => {
  return `https://atd.knack.com/dts#new-service-request/?view_249_vars=%7B%22field_398%22%3A%22Bug%20Report%20%E2%80%94%20Something%20is%20not%20working%22%2C%22field_399%22%3A%22Moped%22%2C%22field_400%22%3A%22${error.message}%22%2C%22field_406%22%3A%22${userEmail}%22%7D`;
};
