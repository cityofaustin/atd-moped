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

export const makeUrlValid = (url) => {
  let validUrl;

  if (url && !url.startsWith("https")) {
    validUrl = "https://" + url;
  }

  return isValidUrl(validUrl) ? validUrl : url;
};
