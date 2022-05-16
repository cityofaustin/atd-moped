export const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",

  // These options are needed to round to whole numbers if that's what you want.
  minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

// Usage:
// currencyFormatter.format(2500); /* $2,500.00 */

/**
 * Remove number string decimal and all following characters
 * @param {String} number - Number string
 * @return {String} Number string with decimal removed and trailing numbers trimmed
 */
export const removeDecimalsAndTrailingNumbers = number =>
  number.replace(/[.](.*)/g, "");

/**
 * Remove all non-integer characters from a number string
 * @param {String} number - Number string
 * @return {String} Number string with only 0-9 integer characters
 */
export const removeNonIntegers = number => number.replace(/[^0-9]/g, "");
