import React from "react";
import { useQuery } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import StaffForm from "./StaffForm";
import StaffUpdateUserStatusButtons from "./components/StaffUpdateUserStatusButtons";
import { useUserApi } from "./helpers";
import { GET_USER } from "src/queries/staff";
import * as yup from "yup";

import {
  Box,
  Button,
  Container,
  Card,
  CardHeader,
  CardContent,
  CircularProgress,
  Divider,
  makeStyles,
} from "@material-ui/core";
import Page from "src/components/Page";
import NotFoundView from "../errors/NotFoundView";

const useStyles = makeStyles((theme) => ({
  formButton: {
    margin: theme.spacing(1),
    color: "white",
  },
}));

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
  const classes = useStyles();

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
  const isUserNonLoginUser =
    data?.moped_users[0]?.roles.includes("non-login-user");

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
                      FormButtons={({
                        isSubmitting,
                        watch,
                        handleCloseModal,
                        setModalState,
                      }) => (
                        <>
                          <Button
                            className={classes.formButton}
                            disabled={isSubmitting}
                            type="submit"
                            color="primary"
                            variant="contained"
                          >
                            Save
                          </Button>
                          <StaffUpdateUserStatusButtons
                            isUserActive={isUserActive}
                            isUserNonLoginUser={
                              watch("roles") !== "non-login-user" &&
                              isUserNonLoginUser
                            }
                            handleCloseModal={handleCloseModal}
                            email={watch("email")}
                            password={watch("password")}
                            roles={watch("roles")}
                            userCognitoId={userCognitoId}
                            setModalState={setModalState}
                          />
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
