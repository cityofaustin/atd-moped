import React from "react";
import StaffForm from "../components/StaffForm";
import { useNavigate } from "react-router-dom";
import { useUserApi } from "../helpers";
import * as yup from "yup";

import {
  Box,
  Container,
  Card,
  CardHeader,
  CardContent,
  Divider,
} from "@material-ui/core";
import Page from "src/components/Page";

export const initialFormValues = {
  first_name: "",
  last_name: "",
  title: "",
  email: "",
  password: "",
  workgroup: "",
  workgroup_id: "",
  roles: ["moped-viewer"],
};

const validationSchema = yup.object().shape({
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  title: yup.string().required(),
  workgroup: yup.string().required(),
  workgroup_id: yup.string().required(),
  email: yup.string().required().email().lowercase(),
  password: yup.string().required(),
  roles: yup.string().required(),
});

const NewStaffView = () => {
  let navigate = useNavigate();

  /**
   * Make use of the useUserApi to retrieve the requestApi function and
   * api request loading state and errors from the api.
   */
  const { loading, requestApi, error, setError, setLoading } = useUserApi();

  /**
   * Submit create user request
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
    <Page title="Staff">
      <Container maxWidth={false}>
        <Box mt={3}>
          <Card>
            <CardHeader title="Add User" />
            <Divider />
            <CardContent>
              <StaffForm
                initialFormValues={initialFormValues}
                onFormSubmit={onFormSubmit}
                userApiErrors={error}
                setUserApiError={setError}
                isUserApiLoading={loading}
                setIsUserApiLoading={setLoading}
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
