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
  FormControl,
  TextField,
  makeStyles,
} from "@material-ui/core";
import Page from "src/components/Page";

const useStyles = makeStyles(theme => ({
  root: {},
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
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
              <FormControl
                className={classes.formControl}
                onSubmit={handleSubmit}
              >
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

                <Button type="submit" color="primary" variant="contained">
                  Submit
                </Button>
              </FormControl>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Page>
  );
};

export default NewStaffView;
