import { useCallback } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";

import {
  Alert,
  Button,
  CircularProgress,
  Grid,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";

import { yupResolver } from "@hookform/resolvers/yup";
import { useSocrataJson } from "src/utils/socrataHelpers";
import { SOCRATA_ENDPOINT } from "src/utils/taskOrderComponentHelpers";
import { filterOptions } from "src/utils/autocompleteHelpers";
import ControlledAutocomplete from "src/components/forms/ControlledAutocomplete";
import ControlledSelect from "src/components/forms/ControlledSelect";
import ControlledTextInput from "src/components/forms/ControlledTextInput";
// import CloseIcon from "@mui/icons-material/Close";
import CheckCircle from "@mui/icons-material/CheckCircle";
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

const ProjectWorkActivitiesForm = ({ activity, onSubmitCallback }) => {
  const {
    loading: statusesLoading,
    error: errorStatuses,
    data: statusesData,
  } = useQuery(WORK_ACTIVITY_STATUSES_QUERY);

  const {
    data: taskOrderData,
    loading: loadingTaskOrders,
    error: errorTaskOrders,
  } = useSocrataJson(SOCRATA_ENDPOINT);

  const defaultValues = useDefaultValues(activity);

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

  const statusOptions = statusesData?.moped_proj_work_activity_status || [];

  const taskOrderOptions = useTaskOrderOptions(taskOrderData);

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
    activity.id ? UPDATE_WORK_ACTIVITY : ADD_WORK_ACTIVITIY
  );

  if (errorStatuses || errorTaskOrders || mutationState.error) {
    console.error(errorStatuses || errorTaskOrders || mutationState.error);
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

  const isNewActivity = !activity.id;

  return (
    <form
      onSubmit={handleSubmit((data) =>
        onSubmitActivity({ data, mutate, onSubmitCallback })
      )}
      autoComplete="off"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth error={formErrors.status_id}>
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
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <ControlledAutocomplete
              control={control}
              name="contractor"
              label="Workgroup/Contractor"
              options={IMPLEMENTATION_WORKGROUP_OPTIONS}
              freeSolo
              autoSelect
              error={formErrors?.contractor}
              valueHandler={(value) => value || null}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <ControlledTextInput
              fullWidth
              label="Contract #"
              name="contract_number"
              control={control}
              size="small"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <ControlledTextInput
              fullWidth
              label="Work Assignment ID"
              name="work_assignment_id"
              control={control}
              size="small"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
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
        </Grid>
        <Grid item xs={12}>
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
              loading={loadingTaskOrders}
              loadingText="Loading..."
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <ControlledTextInput
              fullWidth
              label="Description"
              multiline
              rows={3}
              name="description"
              control={control}
              size="small"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <ControlledTextInput
              fullWidth
              label="Status update"
              multiline
              rows={3}
              name="status_note"
              control={control}
              size="small"
            />
          </FormControl>
        </Grid>
      </Grid>
      <Grid container spacing={2} display="flex" justifyContent="flex-end">
        <Grid item style={{ margin: 5 }}>
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
        </Grid>
      </Grid>
    </form>
  );
};

export default ProjectWorkActivitiesForm;
