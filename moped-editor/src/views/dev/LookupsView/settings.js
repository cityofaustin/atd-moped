import ProjectStatusBadge from "src/views/projects/projectView/ProjectStatusBadge";

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
    <div key={subcomponent.moped_subcomponent.subcomponent_id}>
      {subcomponent.moped_subcomponent.subcomponent_name}
    </div>
  ));

/**
 * Parses an array of component work types into an array of work type names
 * @param {Object[]} workTypes - array of moped_work_types objects
 * @returns { JSX } An array of <div>s with the work type name
 */
const workTypeHandler = (workTypes) =>
  workTypes &&
  workTypes.map((workType) => (
    <div key={workType.moped_work_type.id}>{workType.moped_work_type.name}</div>
  ));

/**
 * Uses phase name and phase key from row object to render status badge
 * @param {string} phaseName - phase name
 * @param {Object} row a single Moped record object as returned from Hasura
 * @returns ProjectStatusBadge component
 */
const statusBadgeHandler = (phaseName, row) => (
  <ProjectStatusBadge
    phaseKey={row.phase_key}
    phaseName={phaseName}
    condensed
  />
);

/**
 * Definitions for data tables.
 * @type { Object[]}  - An array of settings for data tables. Each object references a typename
 * returned from a Hasura query
 */
// milestones
// phases
// tags
export const SETTINGS = [
  /**
   * @type { Object } Settings for one data type
   * @property { string } key - the Hasura object name
   * @property { string } label - a humanized label for this object
   * @property { Object[]} columns - an array of column definitions
   */
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
        key: "moped_components_subcomponents",
        label: "Subcomponents",
        handler: subComponentHandler,
      },
      {
        key: "moped_component_work_types",
        label: "Work types",
        handler: workTypeHandler,
      },
    ],
  },
  {
    key: "moped_component_tags",
    label: "Component tags",
    columns: [
      { key: "id", label: "ID" },
      { key: "full_name", label: "Full name" },
      { key: "slug", label: "Slug" },
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
  {
    key: "moped_fund_status",
    label: "Fund status",
    columns: [
      {
        key: "funding_status_id",
        label: "Status ID",
      },
      {
        key: "funding_status_name",
        label: "Name",
      },
      {
        key: "funding_status_description",
        label: "Description",
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
        label: "Milestone",
      },
      {
        key: "moped_phase",
        label: "Related phase",
        handler: relatedPhaseHandler,
      },
      {
        key: "description",
        label: "Description",
      },
    ],
  },
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
        handler: statusBadgeHandler,
      },
      {
        key: "phase_name_simple",
        label: "Phase name - simple",
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
    key: "moped_project_roles",
    label: "Roles",
    columns: [
      {
        key: "project_role_id",
        label: "Role ID",
      },
      {
        key: "project_role_name",
        label: "Name",
      },
      {
        key: "project_role_description",
        label: "Description",
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
];
