import React from "react";
import StaffForm from "./StaffForm";
import { useNavigate } from "react-router-dom";
import { useUserApi } from "./helpers";
import { useMutation } from "@apollo/client";
import * as yup from "yup";

import {
  Box,
  Button,
  Container,
  Card,
  CardHeader,
  CardContent,
  Divider,
  makeStyles,
} from "@material-ui/core";
import Page from "src/components/Page";
import { ADD_NON_MOPED_USER } from "src/queries/staff";

const useStyles = makeStyles((theme) => ({
  formButton: {
    margin: theme.spacing(1),
    color: "white",
  },
}));

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
  // Password is not required for non-Moped users since they will not be added to Cognito user pool
  password: yup.string().when("roles", {
    is: (val) => val !== "non-login-user",
    then: yup.string().required(),
  }),
  roles: yup.string().required(),
});

const NewStaffView = () => {
  let navigate = useNavigate();
  const classes = useStyles();

  const { loading, requestApi, error, setError, setLoading } = useUserApi();
  const [addNonMopedUser] = useMutation(ADD_NON_MOPED_USER);

  /**
   * Submit create user request
   * @param {Object} data - The data returned from user form to submit to the Moped API
   */
  const onFormSubmit = (data) => {
    // Navigate to user table on successful add/edit
    const callback = () => navigate("/moped/staff");

    const isNonMopedUser = data.roles.includes("non-login-user");

    if (isNonMopedUser) {
      const { password, ...restOfData } = data;

      addNonMopedUser({
        variables: {
          object: restOfData,
        },
      }).then(() => callback());
    } else {
      requestApi({
        method: "post",
        path: "/users/",
        payload: data,
        callback,
      });
    }
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
                FormButtons={({ isSubmitting, reset }) => (
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
                    <Button
                      className={classes.formButton}
                      color="secondary"
                      variant="contained"
                      onClick={() => reset(initialFormValues)}
                    >
                      Reset
                    </Button>
                  </>
                )}
              />
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Page>
  );
};

export default NewStaffView;
