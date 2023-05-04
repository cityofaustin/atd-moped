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
 * Attempt to make a url valid by prepending https:// if it is not already
 * @param {string} url - url to try to make valid
 * @returns {string} - valid url or original url
 */
export const makeUrlValid = (url) => {
  let validUrl;

  if (url && !url.startsWith("https")) {
    validUrl = "https://" + url;
  }

  return isValidUrl(validUrl) ? validUrl : url;
};
