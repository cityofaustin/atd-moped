import { useMemo } from "react";
import * as yup from "yup";

export const phaseValidationSchema = yup.object().shape({
  phase_id: yup
    .number("Phase is required")
    .nullable()
    .required("Phase is required"),
  subphase_id: yup.number().nullable().optional(),
  phase_start: yup
    .date()
    .nullable()
    .optional()
    .when("is_current_phase", {
      is: true,
      then: (schema) => schema.required("Start date is required when phase is current"),
    })
    .typeError("Invalid Date"),
  phase_end: yup.date().nullable().optional().typeError("Invalid Date"),
  is_current_phase: yup.boolean(),
  is_phase_start_confirmed: yup.boolean(),
  is_phase_end_confirmed: yup.boolean(),
  description: yup
    .string()
    .max(500, "Must be less than 500 characters")
    .nullable(),
  project_phase_id: yup.number().nullable().optional(),
  project_id: yup.number().required(),
});

const DEFAULT_FORM_VALUES = {
  project_phase_id: null,
  phase_id: null,
  subphase_id: null,
  phase_start: null,
  is_phase_start_confirmed: true,
  is_phase_end_confirmed: false,
  phase_end: null,
  phase_description: null,
  is_current_phase: false,
  project_id: null,
};

/**
 * Hook which provides initial form values
 * @param {object} phase - an optoinal `moped_proj_phase` object whose values will
 * override the DEFAULT_FORM_VALUES
 */
export const useDefaultValues = (phase) =>
  useMemo(() => {
    // initialize form with default values plus the project id
    let defaultValues = {
      ...DEFAULT_FORM_VALUES,
      project_id: phase.project_id,
    };

    if (phase.project_phase_id) {
      // we are editing a phase: update all defaults from phase
      Object.keys(DEFAULT_FORM_VALUES).forEach((key) => {
        defaultValues[key] = phase[key];
      });
    } else {
      // default the phase_start to midnight (local) on the current date
      defaultValues.phase_start = new Date(
        new Date().setHours(0, 0, 0, 0)
      ).toISOString();
    }
    return defaultValues;
  }, [phase]);

/**
 * Hook which returns an array of subphase options given an input `phase_id`
 * and an array of `moped_phases` objects
 */
export const useSubphases = (phase_id, phases) =>
  useMemo(
    () =>
      phase_id
        ? phases.find((p) => p.phase_id === phase_id)?.moped_subphases || []
        : [],
    [phase_id, phases]
  );

/**
 * Hook which returns an object of phase IDs with their name. Taking
 * the shape of  { [phase_id]: phase_name }
 */
export const usePhaseNameLookup = (phases) =>
  useMemo(
    () =>
      phases.reduce(
        (obj, item) =>
          Object.assign(obj, {
            [item.phase_id]: item.phase_name,
          }),
        {}
      ),
    [phases]
  );

/**
 * Hook which returns an object of subphase IDs with their name. Taking
 * the shape of  { [subphase_id]: subphase_name }
 */
export const useSubphaseNameLookup = (subphases) =>
  useMemo(
    () =>
      subphases.reduce(
        (obj, item) =>
          Object.assign(obj, {
            [item.subphase_id]: item.subphase_name,
          }),
        {}
      ),
    [subphases]
  );

/**
 * Hoolk which returns an array of project_phase_ids of the project's current phase(s).
 * Although only one phase should ever be current, we handle the possibilty that there
 * are multiple
 * @param {Array} projectPhases - array of this project's moped_proj_phases
 * @return {Array} of project_phase_id's of current project phases
 */
export const useCurrentProjectPhaseIDs = (projectPhases) =>
  useMemo(
    () =>
      projectPhases
        ? projectPhases
            .filter(({ is_current_phase }) => is_current_phase)
            .map(({ project_phase_id }) => project_phase_id)
        : [],
    [projectPhases]
  );

/**
 * Hook which returns an array of `moped_proj_phases.project_phase_id`s which
 * need to have their `is_current` flag cleared.
 * @param {int} thisProjectPhaseId - the `project_phase_id` that is being edited
 * @param {bool} isCurrent - if the phase that is being edited is set as the current phase
 * @param {array} currentProjectPhaseIds - an array of all project_phase_ids that are marked as current.
 * (this is the output of the useCurrentProjectPhaseIDs hook)
 * @return {Array} of project_phase_id's which need to set to `is_current` = false
 */
export const useCurrentPhaseIdsToClear = (
  thisProjectPhaseId,
  isCurrent,
  currentProjectPhaseIds
) => {
  if (!isCurrent) {
    // nothing to do
    return [];
  }
  // return all project phase IDs except the one we're editing
  return currentProjectPhaseIds.filter(
    (projectPhaseId) => projectPhaseId !== thisProjectPhaseId
  );
};

export const onSubmitPhase = ({
  data,
  mutate,
  currentPhaseIdsToClear,
  onSubmitCallback,
}) => {
  const { project_phase_id } = data;
  delete data.project_phase_id;

  const variables = {
    current_phase_ids_to_clear: currentPhaseIdsToClear,
  };

  if (!project_phase_id) {
    // inserting a new mutation - which has a slightly different
    // variable shape bc the mutation supports multiple inserts
    // via the phase template feature
    variables.objects = [data];
  } else {
    variables.project_phase_id = project_phase_id;
    variables.object = data;
  }

  mutate({
    variables,
    refetchQueries: ["ProjectSummary"],
  }).then(() => onSubmitCallback());
};
