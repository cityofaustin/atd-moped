import React from "react";
import { useQuery } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import StaffForm from "./StaffForm";
import { initialFormValues } from "./NewStaffView";
import { useUserApi, fieldFormatters } from "./helpers";
import { GET_USER } from "src/queries/staff";
import * as yup from "yup";

import {
  Box,
  Container,
  Card,
  CardHeader,
  CardContent,
  CircularProgress,
  Divider,
} from "@material-ui/core";
import Page from "src/components/Page";
import NotFoundView from "../errors/NotFoundView";

const validationSchema = yup.object().shape({
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  title: yup.string().required(),
  workgroup: yup.string().required(),
  workgroup_id: yup.string().required(),
  email: yup.string().required().email().lowercase(),
  password: yup.string(),
  roles: yup.string().required(),
});

const EditStaffView = () => {
  const { userId } = useParams();
  let navigate = useNavigate();

  /**
   * Make use of the useUserApi to retrieve the requestApi function and
   * api request loading state and errors from the api.
   */
  const { loading, requestApi, error, setError, setLoading } = useUserApi();

  const {
    data,
    loading: isUserQueryLoading,
    error: userQueryError,
  } = useQuery(GET_USER, {
    variables: { userId },
  });

  if (userQueryError) {
    console.log(error);
  }
  const userData = data?.moped_users[0] || null;
  const userCognitoId = data?.moped_users[0]?.cognito_user_id;
  const isUserActive = data?.moped_users[0]?.is_deleted;

  /**
   * Submit edit user request
   * @param {Object} data - The data being submitted
   */
  const onFormSubmit = (data) => {
    // Navigate to user table on successful add/edit
    const callback = () => navigate("/moped/staff");

    requestApi({
      method: "put",
      path: "/users/" + userCognitoId,
      payload: data,
      callback,
    });
  };

  return (
    <>
      {userData === null ? (
        <NotFoundView />
      ) : (
        <Page title="Staff">
          <Container maxWidth={false}>
            <Box mt={3}>
              <Card>
                <CardHeader title="Edit User" />
                <Divider />
                <CardContent>
                  {isUserQueryLoading ? (
                    <CircularProgress />
                  ) : (
                    <StaffForm
                      initialFormValues={userData}
                      onFormSubmit={onFormSubmit}
                      userApiErrors={error}
                      setUserApiError={setError}
                      isUserApiLoading={loading}
                      setIsUserApiLoading={setLoading}
                      showUpdateUserStatusButtons={true}
                      showFormResetButton={false}
                      validationSchema={validationSchema}
                      userCognitoId={userCognitoId}
                      isUserActive={isUserActive}
                    />
                  )}
                </CardContent>
              </Card>
            </Box>
          </Container>
        </Page>
      )}
    </>
  );
};

export default EditStaffView;
