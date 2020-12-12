import React from "react";
import StaffForm from "./StaffForm";

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

const useStyles = makeStyles(() => ({
  root: {},
}));

const NewStaffView = () => {
  const classes = useStyles();

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
