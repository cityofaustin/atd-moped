export const SOCRATA_URL =
  "https://data.austintexas.gov/api/v3/views/p53x-x73x/query.json";

export const PHB_FILTER_STRING = encodeURIComponent(
  `
SELECT *
WHERE
  caseless_eq(\`signal_status\`, "TURNED_ON")
  AND caseless_eq(\`signal_type\`, "PHB")
  AND \`turn_on_date\` IS NOT NULL
ORDER BY \`signal_status\` ASC NULL LAST, \`turn_on_date\` ASC NULL LAST
`.trim(),
);
