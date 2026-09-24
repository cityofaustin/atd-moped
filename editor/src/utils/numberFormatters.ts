/**
 * Format a number as a currency string in USD
 * Usage:
 * currencyFormatter.format(2500); Example: $2,500
 */
export const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",

  // These options are needed to round to whole numbers if that's what you want.
  minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

/**
 * Remove number string decimal and all following characters (decimal removed and trailing numbers trimmed)
 */
export const removeDecimalsAndTrailingNumbers = (number: string) =>
  number.replace(/[.](.*)/g, "");

/**
 * Remove all non-integer characters from a number string and leave only 0-9 integer characters
 */
export const removeNonIntegers = (number: string) =>
  number.replace(/[^0-9]/g, "");

export const INT_4_MAX = 2_147_483_647;
export const outOfRangeErrorMessage = "Amount is too large";

/**
 * Check if number exceeds the maximum number that can be saved in the DB as int4
 */
export const isAmountOutOfRange = (number: number | string | null) => {
  if (number === null) {
    return false;
  }
  return Number(number) > INT_4_MAX;
};
