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
  InputLabel,
  FormHelperText,
} from "@mui/material";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSocrataJson } from "src/utils/socrataHelpers";
import { SOCRATA_ENDPOINT } from "src/utils/taskOrderComponentHelpers";
import { filterOptions } from "src/utils/autocompleteHelpers";
import ControlledAutocomplete from "./ProjectComponents/ControlledAutocomplete";
import ControlledSelect from "src/components/ControlledSelect";
// import CloseIcon from "@mui/icons-material/Close";
import CheckCircle from "@mui/icons-material/CheckCircle";
import {
  WORK_ACTIVITY_STATUSES_QUERY,
  ADD_WORK_ACTIVITIY,
  UPDATE_WORK_ACTIVITY,
} from "src/queries/funding";

const IMPLEMENTATION_WORKGROUP_OPTIONS = [
  "Markigns",
  "Signs",
  "Arterial Management",
  "Other",
];

const validationSchema = yup.object().shape({
  contractor: yup.string().nullable(),
  contract_number: yup.string().nullable(),
  description: yup.string().nullable(),
  work_assignment_id: yup.string().nullable(),
  contract_amount: yup.number().nullable(),
  implementation_workgroup: yup.string().nullable(),
  status_id: yup.number().required(),
  status_note: yup.string().nullable(),
  task_orders: yup.array().optional(),
  id: yup.number().optional(),
  project_id: yup.number().required(),
});

const taskOrderOnChangeHandler = (optionArray, field) => {
  const taskOrders = optionArray?.map((o) => o.value);

  field.onChange(taskOrders || null);
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

const handleTaskOrdersInPayload = (payload) => {
  const { task_orders } = payload;
  if (!task_orders || task_orders?.length === 0) {
    payload.task_orders = null;
  }
};

const onSubmit = ({ data, mutate, onSubmitCallback }) => {
  const { id } = data;

  const payload = payloadFields.reduce((obj, key) => {
    obj[key] = data[key];
    return obj;
  }, {});

  handleTaskOrdersInPayload(payload);

  const variables = { object: payload };

  if (id) {
    variables.id = id;
  } else {
    variables.object.project_id = data.project_id;
  }

  mutate({
    variables,
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
    formState: { isDirty, errors: formErrors },
  } = useForm({
    defaultValues: {
      ...activity,
      task_orders: activity.task_orders || [],
    },
    resolver: yupResolver(validationSchema),
  });

  const statusOptions = statusesData?.moped_proj_work_activity_status;

  const taskOrderOptions = useTaskOrderOptions(taskOrderData);

  const taskOrderValueHandler = useCallback(
    (valueArray) => {
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

  const isNewActivity = !activity.id;

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
            <TextField
              autoFocus={isNewActivity}
              fullWidth
              label="Workgroup/Contractor"
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
              label="Amount"
              {...register("contract_amount")}
            />
          </FormControl>
        </Grid>
        {/* <Grid item xs={12}>
          <FormControl fullWidth>
            <TextField
              fullWidth
              label="Implementation Workgroup"
              {...register("implementation_workgroup")}
            />
          </FormControl>
        </Grid> */}
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
              error={formErrors?.task_orders}
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
        <Grid item xs={12}>
          <FormControl fullWidth error={formErrors.status_id}>
            <InputLabel id="status-label">Status</InputLabel>
            <ControlledSelect
              control={control}
              id="status"
              labelId="status-label"
              name="status_id"
              label="Status"
              size="lg"
              options={statusOptions}
              error={formErrors?.status_id}
            />
            <FormHelperText>Required</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <TextField
              fullWidth
              label="Status update"
              multiline
              rows={3}
              {...register("status_note")}
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
