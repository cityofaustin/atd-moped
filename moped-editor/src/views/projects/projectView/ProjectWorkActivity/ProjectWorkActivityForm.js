import { useCallback } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CheckCircle from "@mui/icons-material/CheckCircle";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid2 from "@mui/material/Grid2";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSocrataJson } from "src/utils/socrataHelpers";
import { SOCRATA_ENDPOINT } from "src/utils/taskOrderComponentHelpers";
import { filterOptions } from "src/utils/autocompleteHelpers";
import ControlledAutocomplete from "src/components/forms/ControlledAutocomplete";
import ControlledSelect from "src/components/forms/ControlledSelect";
import ControlledTextInput from "src/components/forms/ControlledTextInput";
import {
  WORK_ACTIVITY_STATUSES_QUERY,
  ADD_WORK_ACTIVITIY,
  UPDATE_WORK_ACTIVITY,
} from "src/queries/funding";
import {
  amountOnChangeHandler,
  taskOrderOnChangeHandler,
  isTaskOrderOptionEqualToValue,
  useTaskOrderOptions,
  onSubmitActivity,
  useDefaultValues,
  activityValidationSchema,
  IMPLEMENTATION_WORKGROUP_OPTIONS,
} from "./utils/form";

const ProjectWorkActivitiesForm = ({ activity, onSubmitCallback, handleSnackbar }) => {
  /** Status lookup values */
  const {
    loading: loadingStatuses,
    error: errorStatuses,
    data: statusesData,
  } = useQuery(WORK_ACTIVITY_STATUSES_QUERY);

  /** Fetch task order lookup values from Socrata */
  const {
    data: taskOrderData,
    loading: loadingTaskOrders,
    error: errorTaskOrders,
  } = useSocrataJson(SOCRATA_ENDPOINT);

  /** misc form settings */
  const isNewActivity = !activity.id;
  const statusOptions = statusesData?.moped_proj_work_activity_status || [];
  const taskOrderOptions = useTaskOrderOptions(taskOrderData);
  const defaultValues = useDefaultValues(activity);

  /** initiatlize react hook form with validation */
  const {
    handleSubmit,
    control,
    formState: { isDirty, errors: formErrors },
  } = useForm({
    defaultValues: {
      ...defaultValues,
    },
    resolver: yupResolver(activityValidationSchema),
  });

  /** Formats array of task order objects into value prop of multiselect component */
  const taskOrderValueHandler = useCallback(
    (valueArray) => {
      if (!valueArray) {
        // handles when saved value is null
        return [];
      }
      const selectedTks = valueArray?.map((tkOption) => tkOption.task_order);
      return (
        taskOrderOptions?.filter((option) =>
          selectedTks.includes(option.value.task_order)
        ) || []
      );
    },
    [taskOrderOptions]
  );

  const [mutate, mutationState] = useMutation(
    isNewActivity ? ADD_WORK_ACTIVITIY : UPDATE_WORK_ACTIVITY
  );

  if (errorStatuses || errorTaskOrders || mutationState.error) {
    return (
      <Grid2 container spacing={2}>
        <Grid2 size={12}>
          <Alert severity="error">
            Something went wrong. Refresh the page to try again.
          </Alert>
        </Grid2>
      </Grid2>
    );
  } else if (loadingStatuses || loadingTaskOrders) {
    return (
      <Grid2 container spacing={2}>
        <Grid2 size={12}>
          <CircularProgress color="primary" size={20} />
        </Grid2>
      </Grid2>
    );
  }

  return (
    <form
      onSubmit={handleSubmit((data) =>
        onSubmitActivity({ data, mutate, onSubmitCallback, handleSnackbar, isNewActivity })
      )}
      autoComplete="off"
    >
      <Grid2 container spacing={2}>
        {!isNewActivity && (
          <Grid2 size={12}>
            <FormControl fullWidth>
              <TextField
                id="id"
                disabled
                fullWidth
                label="ID"
                size="small"
                value={activity.reference_id}
              />
            </FormControl>
          </Grid2>
        )}
        <Grid2 size={12}>
          <FormControl fullWidth error={!!formErrors?.status_id}>
            <InputLabel id="status-label" required={true}>
              Status
            </InputLabel>
            <ControlledSelect
              control={control}
              id="status"
              labelId="status-label"
              name="status_id"
              label="Status"
              options={statusOptions}
              error={formErrors?.status_id}
              autoFocus={isNewActivity}
              size="small"
              required={true}
            />
            <FormHelperText>Required</FormHelperText>
          </FormControl>
        </Grid2>
        <Grid2 size={12}>
          <FormControl fullWidth error={!!formErrors?.workgroup_contractor}>
            <ControlledAutocomplete
              control={control}
              name="workgroup_contractor"
              label="Workgroup/Contractor"
              options={IMPLEMENTATION_WORKGROUP_OPTIONS}
              freeSolo
              autoSelect
              error={formErrors?.workgroup_contractor}
              valueHandler={(value) => value || null}
            />
            {formErrors?.workgroup_contractor && (
              <FormHelperText>{formErrors.workgroup_contractor.message}</FormHelperText>
            )}
          </FormControl>
        </Grid2>
        <Grid2 size={12}>
          <FormControl fullWidth error={!!formErrors?.contract_number}>
            <ControlledTextInput
              fullWidth
              label="Contract #"
              name="contract_number"
              control={control}
              size="small"
              error={formErrors?.contract_number}
            />
            {formErrors?.contract_number && (
              <FormHelperText>
                {formErrors.contract_number.message}
              </FormHelperText>
            )}
          </FormControl>
        </Grid2>
        <Grid2 size={12}>
          <FormControl fullWidth error={!!formErrors?.work_assignment_id}>
            <ControlledTextInput
              fullWidth
              label="Work Assignment ID"
              name="work_assignment_id"
              control={control}
              size="small"
            />
            {formErrors?.work_assignment_id && (
              <FormHelperText>
                {formErrors.work_assignment_id.message}
              </FormHelperText>
            )}
          </FormControl>
        </Grid2>
        <Grid2 size={12}>
          <FormControl fullWidth>
            <ControlledTextInput
              fullWidth
              label="Amount"
              name="contract_amount"
              control={control}
              onChangeHandler={amountOnChangeHandler}
              size="small"
            />
          </FormControl>
        </Grid2>
        <Grid2 size={12}>
          <FormControl fullWidth>
            <ControlledAutocomplete
              control={control}
              name="task_orders"
              label="Task Orders"
              multiple
              options={taskOrderOptions}
              onChangeHandler={taskOrderOnChangeHandler}
              valueHandler={taskOrderValueHandler}
              filterOptions={filterOptions}
              isOptionEqualToValue={isTaskOrderOptionEqualToValue}
              getOptionLabel={(option) => option?.label || ""}
              error={formErrors?.task_orders}
            />
          </FormControl>
        </Grid2>
        <Grid2 size={12}>
          <FormControl fullWidth error={!!formErrors?.description}>
            <ControlledTextInput
              fullWidth
              label="Description"
              multiline
              rows={3}
              name="description"
              control={control}
              size="small"
            />
            {formErrors?.description && (
              <FormHelperText>{formErrors.description.message}</FormHelperText>
            )}
          </FormControl>
        </Grid2>
        <Grid2 size={12}>
          <FormControl fullWidth error={!!formErrors?.status_note}>
            <ControlledTextInput
              fullWidth
              label="Status update"
              multiline
              rows={3}
              name="status_note"
              control={control}
              size="small"
            />
            {formErrors?.status_note && (
              <FormHelperText>{formErrors.status_note.message}</FormHelperText>
            )}
          </FormControl>
        </Grid2>
        <Grid2 size={12}>
          <FormControl fullWidth error={!!formErrors?.work_order_url}>
            <ControlledTextInput
              control={control}
              fullWidth
              error={!!formErrors?.work_order_url}
              label="Work Order Link"
              name="work_order_url"
              size="small"
            />
            {formErrors?.work_order_url && (
              <FormHelperText>
                {formErrors.work_order_url.message}
              </FormHelperText>
            )}
          </FormControl>
        </Grid2>
      </Grid2>
      <Grid2
        container
        sx={{
          display: "flex",
          justifyContent: "flex-end"
        }}>
        <Grid2 sx={{ marginTop: 2, marginBottom: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CheckCircle />}
            type="submit"
            disabled={(!isDirty && !isNewActivity) || mutationState.loading}
          >
            {mutationState.loading ? (
              <CircularProgress color="primary" size={20} />
            ) : (
              "Save"
            )}
          </Button>
        </Grid2>
      </Grid2>
    </form>
  );
};
export default ProjectWorkActivitiesForm;
