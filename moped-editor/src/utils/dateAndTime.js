/**
 * Format date from the DB in YYYY-MM-DD format into human-readable locale date
 * in MM/DD/YYYY format
 * @param {String} dateString - Date string in date type ("2022-01-15") format
 * @return {String} Date formatted as MM/DD/YYYY
 */
export const formatDateType = dateString => {
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
export const formatTimeStampTZType = timeStampTZString => {
  const dateObject = new Date(timeStampTZString);
  return dateObject.toLocaleDateString("en-US");
};

/**
 * Format timestamptz string from DB ("2022-05-17T22:37:26.072259+00:00")
 * into human-readable locale date in May 19, 2022 format (US expanded forms)
 * @param {String} timeStampTZString - Timestamptz string in ISO format
 * @return {String} Date formatted as Month DD, YYYY
 */
export const makeUSExpandedFormDateFromTimeStampTZ = timeStampTZString => {
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
export const makeHourAndMinutesFromTimeStampTZ = timeStampTZString => {
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
export const makeFullTimeFromTimeStampTZ = timeStampTZString => {
  const dateObject = new Date(timeStampTZString);
  return dateObject.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
};
