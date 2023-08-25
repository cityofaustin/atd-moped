import { useMemo, useCallback } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";


import {
  Alert,
  Button,
  CircularProgress,
  Grid,
  FormControl,
  TextField,
} from "@mui/material";

import { useSocrataJson } from "src/utils/socrataHelpers";
import { SOCRATA_ENDPOINT } from "src/utils/taskOrderComponentHelpers";
import { filterOptions } from "src/utils/autocompleteHelpers";
import ControlledAutocomplete from "./ProjectComponents/ControlledAutocomplete";
// import CloseIcon from "@mui/icons-material/Close";
import CheckCircle from "@mui/icons-material/CheckCircle";
import {
  WORK_ACTIVITY_STATUSES_QUERY,
  ADD_WORK_ACTIVITIY,
  UPDATE_WORK_ACTIVITY,
} from "src/queries/funding";

const statusOnChangeHandler = (option, field) => {
  field.onChange(option?.value || null);
};

const taskOrderOnChangeHandler = (optionArray, field) => {
  field.onChange(optionArray || null);
};

const isTaskOrderOptionEqualToValue = (option, value) => {
  return option.value.task_order === value.value.task_order;
};

const useTaskOrderOptions = (taskOrderData) =>
  useMemo(() => {
    if (!taskOrderData) return;
    return taskOrderData.map((tk) => ({ label: tk.display_name, value: tk }));
  }, [taskOrderData]);

const payloadFields = [
  "contractor",
  "contract_number",
  "description",
  "work_assignment_id",
  "contract_amount",
  "implementation_workgroup",
  "status_id",
  "status_note",
  "task_orders",
];

const onSubmit = ({ data, mutate, onSubmitCallback }) => {
  const payload = payloadFields.reduce((obj, key) => {
    obj[key] = data[key];
    return obj;
  }, {});
  mutate({
    variables: {
      object: payload,
      id: data.id,
    },
  }).then(() => onSubmitCallback());
};

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

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { isDirty, errors },
  } = useForm({
    defaultValues: {
      ...activity,
      task_orders: activity.task_orders || [],
    },
    //   resolver: yupResolver(validationSchema),
  });

  const statusOptions = statusesData?.moped_proj_work_activity_status;

  const statusValueHandler = useCallback(
    (value) => statusOptions.find((o) => o.value === value) || null,
    [statusOptions]
  );

  const taskOrderOptions = useTaskOrderOptions(taskOrderData);

  const taskOrderValueHandler = useCallback(
    (valueArray) => {
      const selectedTks = valueArray?.map(
        (tkOption) => tkOption.value.task_order
      );
      return (
        taskOrderOptions?.filter((option) =>
          selectedTks.includes(option.value.task_order)
        ) || []
      );
    },
    [taskOrderOptions]
  );

  const [mutate, mutationState] = useMutation(
    activity ? UPDATE_WORK_ACTIVITY : ADD_WORK_ACTIVITIY
  );

  if (loadingTaskOrders || statusesLoading) {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <CircularProgress color="primary" size={20} />
        </Grid>
      </Grid>
    );
  }

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

  return (
    <form
      onSubmit={handleSubmit((data) =>
        onSubmit({ data, mutate, onSubmitCallback })
      )}
      autoComplete="off"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <ControlledAutocomplete
              control={control}
              name="status_id"
              label="Status"
              size="lg"
              options={statusOptions}
              onChangeHandler={statusOnChangeHandler}
              valueHandler={statusValueHandler}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <TextField
              fullWidth
              label="Contractor"
              {...register("contractor")}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <TextField
              fullWidth
              label="Contract #"
              {...register("contract_number")}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <TextField
              fullWidth
              label="Work Assignment ID"
              {...register("work_assignment_id")}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <TextField
              fullWidth
              label="Implementation Workgroup"
              {...register("implementation_workgroup")}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <ControlledAutocomplete
              control={control}
              name="task_orders"
              label="Task Orders"
              size="lg"
              multiple
              options={taskOrderOptions}
              onChangeHandler={taskOrderOnChangeHandler}
              valueHandler={taskOrderValueHandler}
              filterOptions={filterOptions}
              isOptionEqualToValue={isTaskOrderOptionEqualToValue}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              {...register("description")}
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

export default ProjectWorkActivitiesForm;
