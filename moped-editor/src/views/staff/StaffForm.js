import React from "react";
import { useForm } from "react-hook-form";

import { Button, Grid, TextField, makeStyles } from "@material-ui/core";
import Page from "src/components/Page";

const useStyles = makeStyles(theme => ({
  root: {},
}));

const StaffForm = ({ editFormData = null }) => {
  const { register, handleSubmit, watch, errors } = useForm({
    defaultValues: editFormData || {},
  });
  const onSubmit = data => console.log(data);

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
