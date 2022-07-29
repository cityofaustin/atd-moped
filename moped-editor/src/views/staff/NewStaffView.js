import React from "react";
import StaffForm from "./StaffForm";
import { useNavigate } from "react-router-dom";
import { useUserApi } from "./helpers";

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
  let navigate = useNavigate();

  /**
   * Make use of the useUserApi to retrieve the requestApi function and
   * api request loading state and errors from the api.
   */
  const {
    loading: userApiLoading,
    requestApi,
    error: apiErrors,
    setError: setApiError,
    setLoading,
  } = useUserApi();

  /**
   * Controls the onSubmit data event
   * @param {Object} data - The data being submitted
   */
  const onFormSubmit = (data) => {
    // Navigate to user table on successful add/edit
    const callback = () => navigate("/moped/staff");

    requestApi({
      method: "post",
      path: "/users/",
      payload: data,
      callback,
    });
  };

  return (
    <Page className={classes.root} title="Staff">
      <Container maxWidth={false}>
        <Box mt={3}>
          <Card className={classes.root}>
            <CardHeader title="Add User" />
            <Divider />
            <CardContent>
              <StaffForm
                onFormSubmit={onFormSubmit}
                apiErrors={apiErrors}
                isRequesting={userApiLoading}
                setApiError={setApiError}
              />
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Page>
  );
};

export default NewStaffView;
