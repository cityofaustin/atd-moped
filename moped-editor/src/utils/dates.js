/**
 * Format date coming from the DB in YYYY-MM-DD format into human-readable locale date
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
 * Format date coming from the DB in timestampz ("2022-05-17T22:37:26.072259+00:00") format
 * into human-readable locale date
 * @param {String} dateString - Date string in ISO format
 * @return {String} Date formatted as MM/DD/YYYY
 */
export const formatTimeStampZType = dateString => {
  const dateObject = new Date(dateString);
  return dateObject.toLocaleDateString("en-US");
};
