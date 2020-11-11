import React from "react";
import { useForm, Controller } from "react-hook-form";

import { gql, useQuery } from "@apollo/react-hooks";
import {
  Button,
  CircularProgress,
  Grid,
  InputLabel,
  TextField,
  MenuItem,
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

const StaffForm = ({ editFormData = null }) => {
  const { register, handleSubmit, watch, errors, control } = useForm({
    defaultValues: editFormData || {},
  });
  const onSubmit = data => console.log(data);

  const {
    loading: workgroupLoading,
    error: workgroupError,
    data: workgroups,
  } = useQuery(WORKGROUPS_QUERY);
  console.log(workgroups);
  // Fields needed
  // email
  // first name
  // last name
  // status - 1 for active
  // title
  // workgroup
  // workgroup_id
  // password
  // roles

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            name="first_name"
            id="first-name"
            label="First Name"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            inputRef={register}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            name="last_name"
            id="last-name"
            label="Last Name"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            inputRef={register}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            name="email"
            id="email"
            label="Email"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            inputRef={register}
          />
        </Grid>
        <Grid item xs={6}>
          <InputLabel id="workgroup-label">Workgroup</InputLabel>
          <Controller
            as={
              <Select
                id="workgroup"
                labelId="workgroup-label"
                label="Workgroup"
                InputLabelProps={{
                  shrink: true,
                }}
                defaultValue={"Choose Workgroup"}
              >
                {workgroupLoading ? (
                  <MenuItem value={""}>
                    <CircularProgress />
                  </MenuItem>
                ) : (
                  workgroups.moped_workgroup.map(workgroup => (
                    <MenuItem value={workgroup.workgroup_id}>
                      {workgroup.workgroup_name}
                    </MenuItem>
                  ))
                )}
              </Select>
            }
            name={"workgroup"}
            control={control}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" color="primary" variant="contained">
            Save
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default StaffForm;
