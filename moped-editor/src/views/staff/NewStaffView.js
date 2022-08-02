import React from "react";
import StaffForm from "./StaffForm";
import { useNavigate } from "react-router-dom";
import { useUserApi } from "./helpers";
import * as yup from "yup";

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

export const initialFormValues = {
  first_name: "",
  last_name: "",
  title: "",
  email: "",
  password: "",
  workgroup: "",
  workgroup_id: "",
  roles: "moped-viewer",
};

const validationSchema = () =>
  yup.object().shape({
    first_name: yup.string().required(),
    last_name: yup.string().required(),
    title: yup.string().required(),
    workgroup: yup.string().required(),
    workgroup_id: yup.string().required(),
    email: yup.string().required().email().lowercase(),
    password: yup.string.required(),
    roles: yup.string().required(),
  });

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
                initialFormValues={initialFormValues}
                showUpdateUserStatusButtons={false}
                showFormResetButton={true}
                validationSchema={validationSchema}
              />
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Page>
  );
};

export default NewStaffView;
