import { format } from "date-fns";

/**
 * Get lookup value for a given table using a record ID and returning a name
 * @param {Array|Object} lookupTable - Lookup table
 * @param {string} attribute - Prefix version of attribute name relying on the pattern of _id and _name
 * @param {number} id - ID used to find target record in lookup table
 * @return {string} - Name of attribute in the given row.
 */
export const getLookupValueByID = (lookupTable, attribute, id) => {
  if (!id) return null;

  return lookupTable.find((item) => item[`${attribute}_id`] === id)[
    `${attribute}_name`
  ];
};

/**
 * Get the time of day to display to users on the dashboard
 * @returns {string} - Time of day phrased as a salutation
 */
export const getTimeOfDay = (date) => {
  const curHr = format(date, "HH");
  switch (true) {
    case curHr < 12:
      return "morning";
    case curHr >= 12 && curHr < 18:
      return "afternoon";
    default:
      return "evening";
  }
};

/**
 * Get the calendar date to display to users on the dashboard
 * @returns {string} - Date formatted in a user-friendly format
 */
export const getCalendarDate = (date) => format(date, "EEEE - LLLL dd, yyyy");
