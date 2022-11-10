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
 * Retrieves phase name from phase object
 * @param {Object} phase - phase object
 * @returns { string } phase name
 */
const relatedPhaseHandler = (phase) => phase?.phase_name;

/**
 * Parses an array of subcomponents into an array of subcomponent names
 * @param {Object[]} subcomponents - array of moped_subcomponents objects
 * @returns { JSX } An array of <div>s with the subcomponent name
 */
const subComponentHandler = (subcomponents) =>
  subcomponents &&
  subcomponents.map((subcomponent) => (
    <div key={subcomponent.subcomponent_id}>
      {subcomponent.subcomponent_name}
    </div>
  ));

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
    label: "Phases",
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
    label: "Milestones",
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
  {
    key: "moped_components",
    label: "Components",
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
        key: "component_id",
        label: "Component ID",
      },
      {
        key: "component_name",
        label: "Component name",
      },
      {
        key: "component_subtype",
        label: "Component subtype",
      },
      {
        key: "line_representation",
        label: "Geometry type",
        handler: (lineRepresentation) =>
          lineRepresentation ? "Line" : "Point",
      },
      {
        key: "moped_subcomponents",
        label: "Subcomponents",
        handler: subComponentHandler,
      },
    ],
  },
  {
    key: "moped_tags",
    label: "Tags",
    columns: [
      {
        key: "id",
        label: "Tag ID",
      },
      {
        key: "type",
        label: "Type",
      },
      {
        key: "name",
        label: "Name",
      },
      {
        key: "slug",
        label: "Slug",
      },
    ],
  },
  {
    key: "moped_entity",
    label: "Entities",
    columns: [
      {
        key: "entity_id",
        label: "ID",
      },
      {
        key: "entity_name",
        label: "Name",
      },
    ],
  },
];
