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
