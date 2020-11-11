import React from "react";
import { useForm } from "react-hook-form";

import {
  Box,
  Button,
  Container,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  TextField,
  makeStyles,
} from "@material-ui/core";
import Page from "src/components/Page";

const useStyles = makeStyles(theme => ({
  root: {},
}));

const NewStaffView = () => {
  const classes = useStyles();

  const { register, handleSubmit, watch, errors } = useForm();
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
    <Page className={classes.root} title="Staff">
      <Container maxWidth={false}>
        <Box mt={3}>
          <Card className={classes.root}>
            <CardHeader title="Add User" />
            <Divider />
            <CardContent>
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
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Page>
  );
};

export default NewStaffView;
