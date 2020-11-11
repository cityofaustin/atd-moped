import React from "react";
import StaffForm from "./StaffForm";
import { useForm } from "react-hook-form";

import {
  Box,
  Container,
  Card,
  CardHeader,
  CardContent,
  Divider,
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
              <StaffForm />
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Page>
  );
};

export default NewStaffView;
