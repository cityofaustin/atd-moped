import { useMemo, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CheckCircle from "@mui/icons-material/CheckCircle";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import { yupResolver } from "@hookform/resolvers/yup";
import ControlledAutocomplete from "src/components/forms/ControlledAutocomplete";
import ControlledDateField from "src/components/forms/ControlledDateField";
import ControlledTextInput from "src/components/forms/ControlledTextInput";
import ControlledCheckbox from "src/components/forms/ControlledCheckbox";
import ControlledSwitch from "src/components/forms/ControlledSwitch";
import { phaseValidationSchema } from "./ProjectPhase/form";
import { useResetDependentFieldOnParentFieldChange } from "./ProjectComponents/utils/form";
import { UPDATE_PROJECT_PHASE, ADD_PROJECT_PHASE } from "src/queries/project";

const DEFAULT_VALUES = {
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
  status_update: null,
};

const useDefaultValues = (phase) =>
  useMemo(() => {
    // initialize form with default values plus the project id
    let defaultValues = { ...DEFAULT_VALUES, project_id: phase.project_id };

    if (phase.project_phase_id) {
      // we are editing a phase: update all defaults from phase
      Object.keys(DEFAULT_VALUES).forEach((key) => {
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

const useSubphases = (phase_id, phases) =>
  useMemo(
    () =>
      phase_id
        ? phases.find((p) => p.phase_id === phase_id)?.moped_subphases || []
        : [],
    [phase_id, phases]
  );

const useCurrentPhaseIdsToClear = (
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
  const { project_phase_id, status_update } = data;
  delete data.project_phase_id;
  delete data.status_update;

  let project_note = null;

  if (status_update) {
    project_note = {
      project_id: data.project_id,
      project_note: status_update,
      added_by_user_id: 1,
      project_note_type: 2,
      phase_id: data.phase_id,
    };
  }

  const variables = {
    current_phase_ids_to_clear: currentPhaseIdsToClear,
    project_note,
  };

  if (!project_phase_id) {
    // inserting a new mutation - which has a slightly different
    // variable shape bc the mutation supports multiple inserts
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

const ProjectPhaseForm = ({
  phase,
  phases,
  currentProjectPhaseIds,
  onSubmitCallback,
}) => {
  console.log("TODO: CHECK SEED DATA!");
  // throw `you need to use metadata preset to handle note added_by_user_id`?
  const isNewPhase = !phase.project_phase_id;

  const defaultValues = useDefaultValues(phase);

  /** initiatlize react hook form with validation */
  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { isDirty, errors: formErrors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(phaseValidationSchema),
  });

  const subphases = useSubphases(watch("phase_id"), phases);

  const isCurrentPhase = watch("is_current_phase");

  useResetDependentFieldOnParentFieldChange({
    parentValue: watch("phase_id"),
    dependentFieldName: "subphase_id",
    valueToSet: null,
    setValue,
  });

  const [mutate, mutationState] = useMutation(
    isNewPhase ? ADD_PROJECT_PHASE : UPDATE_PROJECT_PHASE
  );

  const currentPhaseIdsToClear = useCurrentPhaseIdsToClear(
    phase.project_phase_id,
    isCurrentPhase,
    currentProjectPhaseIds
  );

  const [phase_start, phase_end] = watch(["phase_start", "phase_end"]);

  useEffect(() => {
    if (phase_start !== defaultValues.phase_start) {
      // phase start has been edited
      if (
        phase_start &&
        new Date(phase_start).getTime() < new Date().getTime()
      ) {
        setValue("is_phase_start_confirmed", true);
      }
    }
  }, [phase_start, defaultValues, setValue]);

  useEffect(() => {
    if (phase_end !== defaultValues.phase_end) {
      // phase start has been edited
      if (phase_end && new Date(phase_end).getTime() < new Date().getTime()) {
        setValue("is_phase_end_confirmed", true);
      }
    }
  }, [phase_end, defaultValues, setValue]);

  if (mutationState.error) {
    console.error(mutationState.error);
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Alert severity="error">
            Something went wrong. Refresh the page to try again.
          </Alert>
        </Grid>
      </Grid>
    );
  }

  return (
    <form
      onSubmit={handleSubmit((data) =>
        onSubmitPhase({
          data,
          currentPhaseIdsToClear,
          mutate,
          onSubmitCallback,
        })
      )}
      autoComplete="off"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth error={!!formErrors?.phase_id}>
            <ControlledAutocomplete
              control={control}
              autoFocus={isNewPhase}
              name="phase_id"
              label="Phase"
              options={phases}
              onChangeHandler={(phase, field) =>
                field.onChange(phase?.phase_id || null)
              }
              valueHandler={(value) =>
                value ? phases.find((p) => p.phase_id === value) : null
              }
              isOptionEqualToValue={(option, selectedOption) =>
                option?.phase_id === selectedOption?.phase_id
              }
              getOptionLabel={(option) => option?.phase_name || ""}
              error={formErrors?.phase_id}
            />
            {formErrors?.phase_id && (
              <FormHelperText>{formErrors.phase_id.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth error={!!formErrors?.subphase_id}>
            <ControlledAutocomplete
              control={control}
              name="subphase_id"
              label="Subphase"
              options={subphases}
              disabled={!subphases?.length > 0}
              onChangeHandler={(subphase, field) =>
                field.onChange(subphase?.subphase_id || null)
              }
              valueHandler={(value) =>
                value
                  ? subphases.find((s) => s.subphase_id === value) || null
                  : null
              }
              isOptionEqualToValue={(option, selectedOption) =>
                option?.subphase_id === selectedOption?.subphase_id
              }
              getOptionLabel={(option) => option?.subphase_name || ""}
              error={formErrors?.subphase_id}
            />
            {formErrors?.subphase_id && (
              <FormHelperText>{formErrors.subphase_id.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={8}>
          <FormControl fullWidth error={!!formErrors?.phase_start}>
            <ControlledDateField
              name="phase_start"
              label="Start"
              control={control}
            />
            {formErrors?.phase_start && (
              <FormHelperText>{formErrors?.phase_start.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl fullWidth>
            <ControlledCheckbox
              name="is_phase_start_confirmed"
              control={control}
              label="Confirmed"
            />
          </FormControl>
        </Grid>
        <Grid item xs={8}>
          <FormControl fullWidth error={!!formErrors?.phase_end}>
            <ControlledDateField
              name="phase_end"
              label="End"
              control={control}
              errorMessage={formErrors?.phase_end?.message || ""}
            />
            {formErrors?.phase_end && (
              <FormHelperText>{formErrors.phase_end.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl fullWidth>
            <ControlledCheckbox
              name="is_phase_end_confirmed"
              control={control}
              label="Confirmed"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth error={!!formErrors?.phase_description}>
            <ControlledTextInput
              fullWidth
              label="Description"
              multiline
              rows={3}
              name="phase_description"
              control={control}
              size="small"
            />
            {formErrors?.phase_description && (
              <FormHelperText>
                {formErrors.phase_description.message}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item container justifyContent="flex-end">
          <FormControl>
            <ControlledSwitch
              name="is_current_phase"
              control={control}
              label="Current phase"
            />
          </FormControl>
        </Grid>
        {isCurrentPhase && isNewPhase && (
          <Grid item xs={12}>
            <FormControl fullWidth error={!!formErrors?.status_update}>
              <ControlledTextInput
                fullWidth
                label="Status update"
                multiline
                rows={3}
                name="status_update"
                control={control}
                size="small"
                helperText="Optionally include a project status update"
              />
              {formErrors?.status_update && (
                <FormHelperText>
                  {formErrors.status_update.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
        )}
      </Grid>
      <Grid container display="flex" justifyContent="flex-end">
        <Grid item sx={{ marginTop: 2, marginBottom: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CheckCircle />}
            type="submit"
            disabled={(!isDirty && !isNewPhase) || mutationState.loading}
          >
            {mutationState.loading ? (
              <CircularProgress color="primary" size={20} />
            ) : (
              "Save"
            )}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ProjectPhaseForm;
