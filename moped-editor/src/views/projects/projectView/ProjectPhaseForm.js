import { useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CheckCircle from "@mui/icons-material/CheckCircle";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import { yupResolver } from "@hookform/resolvers/yup";
import ControlledAutocomplete from "src/components/forms/ControlledAutocomplete";
import ControlledDateField from "src/components/forms/ControlledDateField";
import ControlledTextInput from "src/components/forms/ControlledTextInput";
import ControlledCheckbox from "src/components/forms/ControlledCheckbox";
import ControlledSwitch from "src/components/forms/ControlledSwitch";
import {
  phaseValidationSchema,
  onSubmitPhase,
  onSubmitStatusUpdate,
  useDefaultValues,
  useSubphases,
  useCurrentPhaseIdsToClear,
} from "./ProjectPhase/helpers";
import { getSessionDatabaseData } from "src/auth/user";
import { useResetDependentFieldOnParentFieldChange } from "./ProjectComponents/utils/form";
import { UPDATE_PROJECT_PHASE, ADD_PROJECT_PHASE } from "src/queries/project";
import { ADD_PROJECT_NOTE } from "src/queries/notes";
import theme from "src/theme";

const ProjectPhaseForm = ({
  phase,
  phases,
  currentProjectPhaseIds,
  onSubmitCallback,
}) => {
  const isNewPhase = !phase.project_phase_id;
  const userSessionData = getSessionDatabaseData();

  const defaultValues = useDefaultValues(phase);

  /** initialize react hook form with validation */
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
  const [addStatusUpdate, addStatusUpdateState] = useMutation(ADD_PROJECT_NOTE);

  const currentPhaseIdsToClear = useCurrentPhaseIdsToClear(
    phase.project_phase_id,
    isCurrentPhase,
    currentProjectPhaseIds
  );

  const [phase_start, phase_end, is_current_phase] = watch([
    "phase_start",
    "phase_end",
    "is_current_phase",
  ]);

  const onSubmit = (data) => {
    const { status_update, ...phaseData } = data;

    onSubmitPhase({
      data: phaseData,
      currentPhaseIdsToClear,
      mutate,
      onSubmitCallback,
    });

    if (status_update) {
      const { project_id, phase_id } = phaseData;
      const { user_id } = userSessionData;
      const statusUpdateData = { status_update, project_id, phase_id, user_id };

      onSubmitStatusUpdate({ data: statusUpdateData, mutate: addStatusUpdate });
    }
  };

  /**
   * Defaults is_phase_start_confirmed to true if date is today or before
   */
  useEffect(() => {
    if (phase_start !== defaultValues.phase_start) {
      // phase start has been edited
      if (
        phase_start &&
        new Date(phase_start).getTime() < new Date().getTime()
      ) {
        // date is in the past, so default to confirmed
        setValue("is_phase_start_confirmed", true);
      } else if (
        phase_start &&
        new Date(phase_start).getTime() > new Date().getTime()
      ) {
        // date is in the future, so default to not confirmed
        setValue("is_phase_start_confirmed", false);
      }
    }
    // clear confirmed status as needed
    if (phase_start === null) {
      setValue("is_phase_start_confirmed", false);
    }
  }, [phase_start, defaultValues, setValue]);

  /**
   * Defaults is_phase_end_confirmed to true if date is today or before
   */
  useEffect(() => {
    if (phase_end !== defaultValues.phase_end) {
      // phase end has been edited
      if (phase_end && new Date(phase_end).getTime() <= new Date().getTime()) {
        // date is in the past, so default to confirmed
        setValue("is_phase_end_confirmed", true);
      } else if (
        phase_end &&
        new Date(phase_end).getTime() > new Date().getTime()
      ) {
        // date is in the future, so default to not confirmed
        setValue("is_phase_end_confirmed", false);
      }
    }
    // clear confirmed status as needed
    if (phase_end === null) {
      setValue("is_phase_end_confirmed", false);
    }
  }, [phase_end, defaultValues, setValue]);

  /**
   * Defaults phase_start to today if current phase is true and there is no phase_start
   */
  useEffect(() => {
    if (is_current_phase === true && phase_start === null) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      setValue("phase_start", today);
    }
  }, [is_current_phase, phase_start, setValue]);

  if (mutationState.error || addStatusUpdateState.error) {
    console.error("Phase mutation error", mutationState.error);
    console.error("Status update mutation error", addStatusUpdateState.error);
    return (
      <Grid container spacing={2}>
        {mutationState.error ? (
          <Grid item xs={12}>
            <Alert severity="error">
              Something went wrong with the phase submission. Refresh the page
              to try again.
            </Alert>
          </Grid>
        ) : null}
        {addStatusUpdateState.error ? (
          <Grid item xs={12}>
            <Alert severity="error">
              Something went wrong with the status update. Refresh the page to
              try again.
            </Alert>
          </Grid>
        ) : null}
      </Grid>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
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
              error={!!formErrors?.phase_id}
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
              error={!!formErrors?.subphase_id}
            />
            {formErrors?.subphase_id && (
              <FormHelperText>{formErrors.subphase_id.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item container justifyContent="flex-start">
          <FormControl>
            <ControlledSwitch
              name="is_current_phase"
              control={control}
              label="Current phase"
            />
            <FormHelperText>
              Set this phase as the project's current phase
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={8}>
          <FormControl fullWidth error={!!formErrors?.phase_start}>
            <ControlledDateField
              name="phase_start"
              label="Start"
              control={control}
              error={!!formErrors?.phase_start}
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
              error={!!formErrors?.phase_end}
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
        <Grid item xs={12} sx={{ marginY: theme.spacing(2) }}>
          <Divider />
        </Grid>
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
            />
            <FormHelperText>
              Optionally add a status update to the project
            </FormHelperText>
            {formErrors?.status_update && (
              <FormHelperText>
                {formErrors.status_update.message}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
      </Grid>
      <Grid container display="flex" justifyContent="flex-end">
        <Grid item sx={{ marginTop: 2, marginBottom: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CheckCircle />}
            type="submit"
            disabled={
              (!isDirty && !isNewPhase) ||
              mutationState.loading ||
              addStatusUpdateState.loading
            }
          >
            {mutationState.loading || addStatusUpdateState.loading ? (
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
