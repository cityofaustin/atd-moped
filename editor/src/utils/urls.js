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
  const errorMessage = error?.message;
  const params = {
    field_400: errorMessage,
    field_398: "Bug Report — Something is not working",
    field_406: userEmail,
    field_1130: ["5d8938ed899f8d001156b66f"],
  };
  const queryString = encodeURIComponent(JSON.stringify(params));
  return `https://atd.knack.com/dts#new-service-request/?view_249_vars=${queryString}`;
};

// Returns link text based on url when no text prop is provided, can be expanded to include more cases as needed
export const getExternalLinkText = (url) => {
  if (typeof url !== "string") {
    return null;
  }
  switch (true) {
    case url.toLowerCase().includes("https://atd.knack.com/amd"):
      return "AMD Data Tracker";
    case url.toLowerCase().includes("https://atd.knack.com/signs-markings"):
      return "Signs & Markings";
    default:
      return null;
  }
};
