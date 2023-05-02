import * as yup from "yup";

/**
 * Validate a non-empty string url using yup
 * @param {string} url - url to validate
 * @returns {Boolean} is the url valid?
 */
export const isValidUrl = (url) => {
  if (url === "") return false;

  return yup.string().url().isValidSync(url);
};
