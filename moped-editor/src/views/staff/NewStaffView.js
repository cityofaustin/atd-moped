import React from "react";
import StaffForm from "./StaffForm";

import { Box, Container, Card, CardHeader, CardContent, Divider } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
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
