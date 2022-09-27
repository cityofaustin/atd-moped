import React from "react";
import { useQuery } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import StaffForm from "./StaffForm";
import StaffUpdateUserStatusButtons from "./components/StaffUpdateUserStatusButtons";
import { useUserApi, nonLoginUserRole, isUserNonLoginUser } from "./helpers";
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
import { StaffFormSaveButton } from "./components/StaffFormButtons";
import NonLoginUserActivationButtons from "./components/NonLoginUserActivationButtons";

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

  const { loading, requestApi, error, setError, setLoading } = useUserApi();

  // Get the user data so we can populate the form with existing user details
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
  const isUserActive = !data?.moped_users[0]?.is_deleted;
  const isNonLoginUser = isUserNonLoginUser(data?.moped_users[0]?.roles);

  /**
   * Submit edit user request
   * @param {Object} data - The data returned from user form to submit to the Moped API
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

  const existingNonLoginUserRoleOptions = [
    { value: nonLoginUserRole, name: "Non-login User" },
  ];
  const existingLoginUserRoleOptions = [
    { value: "moped-editor", name: "Editor" },
    { value: "moped-admin", name: "Admin" },
  ];

  return (
    <>
      {data && !data?.moped_users?.length && <NotFoundView />}
      {data && !!data?.moped_users?.length && (
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
                      isPasswordFieldDisabled={false}
                      roleOptions={
                        isNonLoginUser
                          ? existingNonLoginUserRoleOptions
                          : existingLoginUserRoleOptions
                      }
                      FormButtons={({
                        isSubmitting,
                        watch,
                        handleCloseModal,
                        setModalState,
                      }) => (
                        <>
                          {!isNonLoginUser && (
                            <StaffFormSaveButton disabled={isSubmitting} />
                          )}
                          {!isNonLoginUser && (
                            <StaffUpdateUserStatusButtons
                              isUserActive={isUserActive}
                              handleCloseModal={handleCloseModal}
                              email={watch("email")}
                              password={watch("password")}
                              roles={watch("roles")}
                              userCognitoId={userCognitoId}
                              setModalState={setModalState}
                            />
                          )}
                          {isNonLoginUser && (
                            <NonLoginUserActivationButtons
                              isUserActive={isUserActive}
                              setModalState={setModalState}
                              handleCloseModal={handleCloseModal}
                              userId={userId}
                              formValues={watch()}
                            />
                          )}
                        </>
                      )}
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
