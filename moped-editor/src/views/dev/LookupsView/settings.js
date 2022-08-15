/**
 * Parses an array of phase-subphases into an array of subphase names
 * @param {Object[]} subphases - array of moped_subphases objects
 * @returns { JSX } An array of <div>s with the subphase name
 */
const subPhaseHandler = (subphases) =>
  subphases &&
  subphases.map((subphase) => (
    <div key={subphase.subphase_id}>{subphase.subphase_name}</div>
  ));

/**
 * Parses an array of phase-subphases into an array of subphase names
 * @param {Object[]} subphases - array of moped_subphases objects
 * @returns { JSX } An array of <div>s with the subphase name
 */
const relatedPhaseHandler = (phase) => phase?.phase_name;

/**
 * Definitions for data tables.
 * @type { Object[]}  - An array of settings for data tables. Each object references a typename
 * returned from a Hasura query
 */
export const SETTINGS = [
  /**
   * @type { Object } Settings for one data type
   * @property { string } key - the Hasura object name
   * @property { string } label - a humanized label for this object
   * @property { Object[]} columns - an array of column definitions
   */
  {
    key: "moped_phases",
    label: "Moped phases",
    columns: [
      /**
       * @type { Object } Column definition
       * @property { string } key - the accessor that will be used to retrieve data from a table row
       * object
       * @property { string} label - a human-friendly label which will be used as a table column header
       * @property { Function } [handler] - an optional transform function that receives any object and
       * returns a string. You'll want to use this on complex data types.
       */
      {
        key: "phase_order",
        label: "Phase order",
      },
      {
        key: "phase_id",
        label: "Phase ID",
      },
      {
        key: "phase_name",
        label: "Phase name",
      },
      {
        key: "phase_description",
        label: "Description",
      },
      {
        key: "moped_subphases",
        label: "Subphases",
        handler: subPhaseHandler,
      },
    ],
  },
  {
    key: "moped_milestones",
    label: "Moped milestones",
    columns: [
      {
        key: "milestone_id",
        label: "Milestone ID",
      },
      {
        key: "milestone_name",
        label: "Milestone name",
      },
      {
        key: "moped_phase",
        label: "Related phase",
        handler: relatedPhaseHandler,
      },
      {
        key: "milestone_order",
        label: "Milestone order",
      },
      {
        key: "milestone_description",
        label: "Description",
      },
    ],
  },
];
