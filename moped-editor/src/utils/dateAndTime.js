/**
 * Format date from the DB in YYYY-MM-DD format into human-readable locale date
 * in MM/DD/YYYY format
 * @param {String} dateString - Date string in date type ("2022-01-15") format
 * @return {String} Date formatted as MM/DD/YYYY
 */
export const formatDateType = (dateString) => {
  const dateObject = new Date(dateString);
  return dateObject.toLocaleDateString("en-US", {
    timeZone: "UTC",
  });
};

/**
 * Format timestamptz string from the DB ("2022-05-17T22:37:26.072259+00:00")
 * into human-readable locale date in MM/DD/YYYY format
 * @param {String} timeStampTZString - Timestamptz string in ISO format
 * @return {String} Date formatted as MM/DD/YYYY
 */
export const formatTimeStampTZType = (timeStampTZString) => {
  if (timeStampTZString === null) return "";

  const dateObject = new Date(timeStampTZString);
  return dateObject.toLocaleDateString("en-US");
};

/**
 * Format timestamptz string from DB ("2022-05-17T22:37:26.072259+00:00")
 * into human-readable locale date in May 19, 2022 format (US expanded forms)
 * @param {String} timeStampTZString - Timestamptz string in ISO format
 * @return {String} Date formatted as Month DD, YYYY
 */
export const makeUSExpandedFormDateFromTimeStampTZ = (timeStampTZString) => {
  const dateObject = new Date(timeStampTZString);
  return dateObject.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Format timestamptz string from DB ("2022-05-17T22:37:26.072259+00:00")
 * into human-readable locale time in 11:31 PM format
 * @param {String} timeStampTZString - Timestamptz string in ISO format
 * @return {String} Time formatted as HH:MM XM
 */
export const makeHourAndMinutesFromTimeStampTZ = (timeStampTZString) => {
  const dateObject = new Date(timeStampTZString);
  return dateObject.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
  });
};

/**
 * Format timestamptz string from DB ("2022-05-17T22:37:26.072259+00:00")
 * into human-readable locale time in 11:31:22 PM format
 * @param {String} timeStampTZString - Timestamptz string in ISO format
 * @return {String} Time formatted as HH:MM:SS XM
 */
export const makeFullTimeFromTimeStampTZ = (timeStampTZString) => {
  const dateObject = new Date(timeStampTZString);
  return dateObject.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
};

const MILLS_CONVERSION = {
  minute: 60_000,
  hour: 3_600_000,
  day: 86_400_000,
};

/**
 * Format millseconds into a relative description
 * @param {integer} millsElapsed - the elapsed time in milliseconds to format
 * @param {string} unitName - the name of the units to convert to - the string must
 * be defined in the MILLS_CONVERSION object
 * @returns {string} in format  `<value> <unit-name> ago`
 */
const formatRelativeTime = (millsElapsed, unitName) => {
  const factor = MILLS_CONVERSION[unitName];
  const millsConverted = Math.round(millsElapsed / factor);
  const singular = millsConverted === 1;
  return `${millsConverted} ${unitName}${singular ? "" : "s"} ago`;
};

/**
 * Returns a humanized duration of a timestamp relative to now
 * Behaves similarly to https://github.com/github/relative-time-element
 * @param {*} timeStampTZString - Timestamp string in ISO format
 * @returns {string} a humanized description of a timestamp as follows:
 * - less than 1 minute: 'Just now'
 * - less than 1 hour: 'X minute(s) ago'
 * - less than 1 day: 'x hours ago'
 * - less than 30 days: 'x days ago'
 * - else: Date.toLocaleTimeString() (e.g., 1/23/2023)
 */
export const formatRelativeDate = (timeStampTZString) => {
  const targetDate = new Date(timeStampTZString);
  const millsElapsed = new Date().getTime() - targetDate.getTime();
  if (millsElapsed > MILLS_CONVERSION.day * 30) {
    return targetDate.toLocaleDateString("en-US");
  } else if (millsElapsed < MILLS_CONVERSION.minute) {
    return "Just now";
  } else if (millsElapsed < MILLS_CONVERSION.hour - MILLS_CONVERSION.minute) {
    return formatRelativeTime(millsElapsed, "minute");
  } else if (millsElapsed < MILLS_CONVERSION.day - MILLS_CONVERSION.hour) {
    return formatRelativeTime(millsElapsed, "hour");
  } else {
    return formatRelativeTime(millsElapsed, "day");
  }
};
