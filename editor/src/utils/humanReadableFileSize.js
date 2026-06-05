/**
 * Format bytes as human-readable text.
 *
 * @param {int} bytes - Number of bytes.
 * @param {boolean} si - True to use metric (SI) units, aka powers of 1000. False to use binary (IEC), aka powers of 1024.
 * @param {int} dp - Number of decimal places to display.
 *
 * @return {string} - Formatted string.
 */
const humanReadableFileSize = (bytes, si = false, dp = 1) => {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return Math.round(bytes.toFixed(dp)) + " " + units[u];
};

export default humanReadableFileSize;
