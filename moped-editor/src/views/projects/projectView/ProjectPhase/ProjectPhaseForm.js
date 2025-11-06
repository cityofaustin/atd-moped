import { useEffect, useState } from "react";
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
import Tooltip from "@mui/material/Tooltip";
import { yupResolver } from "@hookform/resolvers/yup";
import ControlledAutocomplete from "src/components/forms/ControlledAutocomplete";
import ControlledDateField from "src/components/forms/ControlledDateField";
import ControlledTextInput from "src/components/forms/ControlledTextInput";
import ControlledCheckbox from "src/components/forms/ControlledCheckbox";
import {
  phaseValidationSchema,
  onSubmitPhase,
  useDefaultValues,
  useSubphases,
} from "./helpers";
import { useSessionDatabaseData } from "src/auth/user";
import { useResetDependentFieldOnParentFieldChange } from "../ProjectComponents/utils/form";
import {
  UPDATE_PROJECT_PHASE_AND_ADD_STATUS_UPDATE,
  ADD_PROJECT_PHASE_AND_STATUS_UPDATE,
} from "src/queries/project";
import theme from "src/theme";
import { useNoteTypeObject } from "../ProjectNotes";

const ProjectPhaseForm = ({
  phase,
  phases,
  noteTypes,
  currentProjectPhaseId,
  currentPhaseTypeId,
  onSubmitCallback,
  handleSnackbar,
}) => {
  const [isSetAsCurrentPhase, setAsCurrentPhase] = useState(false);

  const isNewPhase = !phase.project_phase_id;
  const isCurrentPhase = phase.is_current_phase;
  const userSessionData = useSessionDatabaseData();

  const noteTypesIDLookup = useNoteTypeObject(noteTypes);
  const statusNoteTypeID = noteTypesIDLookup["status_update"];

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

  useResetDependentFieldOnParentFieldChange({
    parentValue: watch("phase_id"),
    dependentFieldName: "subphase_id",
    valueToSet: null,
    setValue,
  });

  const [mutate, mutationState] = useMutation(
    isNewPhase
      ? ADD_PROJECT_PHASE_AND_STATUS_UPDATE
      : UPDATE_PROJECT_PHASE_AND_ADD_STATUS_UPDATE
  );

  const [phase_start, phase_end] = watch(["phase_start", "phase_end"]);

  const onSubmit = (data) => {
    const { status_update, ...phaseData } = data;
    let noteData = null;

    if (status_update) {
      const { user_id } = userSessionData;
      noteData = { status_update, user_id, statusNoteTypeID };
    }

    if (isSetAsCurrentPhase) {
      phaseData["is_current_phase"] = true;
      /* Defaults phase_start to today if there is no phase_start */
      if (!phase_start) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        phaseData["phase_start"] = today;
        phaseData["is_phase_start_confirmed"] = true;
      }
    }

    onSubmitPhase({
      phaseData,
      noteData,
      mutate,
      isNewPhase,
      currentProjectPhaseId,
      isSetAsCurrentPhase,
      currentPhaseTypeId,
      onSubmitCallback,
      handleSnackbar,
    });
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

  if (mutationState.error) {
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
        <Grid item xs={8}>
          <FormControl fullWidth error={!!formErrors?.phase_start}>
            <ControlledDateField
              name="phase_start"
              label="Start"
              control={control}
              error={!!formErrors?.phase_start}
            />
            {!isCurrentPhase && (
              <FormHelperText>
                Defaults to today (confirmed) if blank when marked as current
              </FormHelperText>
            )}
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
        <Grid item sx={{ marginTop: 2, marginBottom: 2, marginRight: 2 }}>
          <Tooltip title="Mark this phase as the current phase of the project">
            <span>
              {/* Tooltip needs to listen to child element events, span is needed if button is disabled */}
              <Button
                variant="outlined"
                color="primary"
                startIcon={<CheckCircle />}
                type="submit"
                onClick={() => setAsCurrentPhase(true)}
                // disabled if a current phase
                disabled={
                  isCurrentPhase ||
                  mutationState.loading ||
                  (isNewPhase && !isDirty)
                }
              >
                {mutationState.loading ? (
                  <CircularProgress color="primary" size={20} />
                ) : (
                  "Save and mark as current"
                )}
              </Button>
            </span>
          </Tooltip>
        </Grid>
        <Grid item sx={{ marginTop: 2, marginBottom: 2 }}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={!isDirty || mutationState.loading}
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
