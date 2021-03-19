import config from "../config";
import { DateTime } from "luxon";

/**
 * Parses a SQL-Formatted date and adjusts for the current timezone offset in minutes
 * @param {string} utcDate - The date being parsed
 */
export default utcDate =>
  DateTime.fromISO(utcDate).minus({ minutes: config.user.timezoneOffset });
