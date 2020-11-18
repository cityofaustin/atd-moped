import React from "react";
import { useUserApi } from "./helpers";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { gql, useQuery } from "@apollo/react-hooks";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  FormHelperText,
  Grid,
  InputLabel,
  TextField,
  makeStyles,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@material-ui/core";

const WORKGROUPS_QUERY = gql`
  query GetWorkgroups {
    moped_workgroup {
      workgroup_id
      workgroup_name
    }
  }
`;

const useStyles = makeStyles(() => ({
  formSelect: {
    minWidth: 195,
  },
}));

const initialFormValues = {
  first_name: "",
  last_name: "",
  title: "",
  email: "",
  password: "",
  workgroup: "",
  workgroup_id: "",
  roles: "moped-viewer",
  status_id: "1",
};

const roles = [
  { value: "moped-viewer", name: "Viewer" },
  { value: "moped-editor", name: "Editor" },
  { value: "moped-admin", name: "Admin" },
];

const statuses = [
  { value: "1", name: "Active" },
  { value: "0", name: "Inactive" },
];

const staffValidationSchema = yup.object().shape({
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  title: yup.string().required(),
  workgroup: yup.string().required(),
  workgroup_id: yup.string().required(),
  email: yup.string().required(),
  password: yup.string().required(),
  roles: yup.string().required(),
  status_id: yup.string().required(),
});

const fieldParsers = {
  status_id: id => parseInt(id),
  workgroup_id: id => parseInt(id),
  roles: role => [role],
};

const StaffForm = ({ editFormData = null }) => {
  const classes = useStyles();
  const [userApiResult, userApiLoading, requestApi] = useUserApi();

  const { register, handleSubmit, errors, control, setValue } = useForm({
    defaultValues: editFormData || initialFormValues,
    resolver: yupResolver(staffValidationSchema),
  });

  const onSubmit = data => {
    // Parse values with fns from config
    Object.entries(fieldParsers).forEach(([fieldName, parser]) => {
      const originalValue = data[fieldName];
      const parsedValue = parser(originalValue);

      data[fieldName] = parsedValue;
    });

    // POST or PUT request to User Management API
    const requestString = editFormData === null ? "post" : "put";
    const requestPath = "/users/";

    requestApi(requestString, requestPath, data);
    console.log(userApiResult);
  };

  const {
    loading: workgroupLoading,
    error: workgroupError,
    data: workgroups,
  } = useQuery(WORKGROUPS_QUERY);

  const updateWorkgroupFields = e => {
    const workgroupId = e.nativeEvent.target.dataset.id;
    const workgroupName = e.target.value;

    // When workgroup field updates, set corresponding workgroup_id value
    setValue("workgroup_id", workgroupId);

    // React Hook Form expects the custom onChange action to return workgroup field value
    return workgroupName;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            name="first_name"
            id="first-name"
            label="First Name"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            inputRef={register}
            helperText={errors.first_name?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="last_name"
            id="last-name"
            label="Last Name"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            inputRef={register}
            helperText={errors.last_name?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="title"
            id="title"
            label="Title"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            inputRef={register}
            helperText={errors.title?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="email"
            id="email"
            label="Email"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            inputRef={register}
            helperText={errors.email?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="password"
            id="password"
            label="Password"
            type="password"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            inputRef={register}
            helperText={errors.password?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl variant="outlined" className={classes.formSelect}>
            <InputLabel id="workgroup-label">Workgroup</InputLabel>
            <Controller
              render={({ onChange, ref, value }) => (
                <Select
                  id="workgroup"
                  labelId="workgroup-label"
                  label="Workgroup"
                  onChange={e => onChange(updateWorkgroupFields(e))}
                  inputRef={ref}
                  value={value}
                >
                  {!workgroupLoading &&
                    workgroups.moped_workgroup.map(workgroup => (
                      <MenuItem
                        key={workgroup.workgroup_id}
                        value={workgroup.workgroup_name}
                        data-id={workgroup.workgroup_id}
                      >
                        {workgroup.workgroup_name}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name={"workgroup"}
              control={control}
            />
            {workgroupError && (
              <FormHelperText>
                Workgroups failed to load. Please refresh.
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <TextField
          id="workgroup-id"
          name="workgroup_id"
          inputRef={register}
          type="hidden"
        />
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel id="roles-label">Role</FormLabel>
            <Controller
              as={
                <RadioGroup aria-label="roles" name="roles">
                  {roles.map(role => (
                    <FormControlLabel
                      key={role.value}
                      value={role.value}
                      control={<Radio />}
                      label={role.name}
                    />
                  ))}
                </RadioGroup>
              }
              name={"roles"}
              control={control}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel id="statuses-label">Status</FormLabel>
            <Controller
              as={
                <RadioGroup aria-label="statuses" name="status_id">
                  {statuses.map(status => (
                    <FormControlLabel
                      key={status.value}
                      value={status.value}
                      control={<Radio />}
                      label={status.name}
                    />
                  ))}
                </RadioGroup>
              }
              name={"status_id"}
              control={control}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button
            disabled={userApiLoading}
            type="submit"
            color="primary"
            variant="contained"
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default StaffForm;
