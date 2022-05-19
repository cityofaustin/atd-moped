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
 * Format timestampz string from the DB ("2022-05-17T22:37:26.072259+00:00")
 * into human-readable locale date in MM/DD/YYYY format
 * @param {String} timeStampZString - Timestampz string in ISO format
 * @return {String} Date formatted as MM/DD/YYYY
 */
export const formatTimeStampZType = timeStampZString => {
  const dateObject = new Date(timeStampZString);
  return dateObject.toLocaleDateString("en-US");
};

/**
 * Format timestampz string from DB ("2022-05-17T22:37:26.072259+00:00")
 * into human-readable locale date in May 19, 2022 format (US expanded forms)
 * @param {String} timeStampZString - Timestampz string in ISO format
 * @return {String} Date formatted as May
 */
export const makeUSExpandedFormDateFromTimeStamp = timeStampZString => {
  const dateObject = new Date(timeStampZString);
  return dateObject.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Format timestampz string from DB ("2022-05-17T22:37:26.072259+00:00")
 * into human-readable locale time in 11:31 PM format
 * @param {String} timeStampZString - Timestampz string in ISO format
 * @return {String} Date formatted as May
 */
export const makeHourAndMinutesFromTimeStamp = timeStampZString => {
  const dateObject = new Date(timeStampZString);
  return dateObject.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
  });
};
