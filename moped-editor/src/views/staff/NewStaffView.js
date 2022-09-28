import React from "react";
import StaffForm from "./StaffForm";
import {
  StaffFormResetButton,
  StaffFormSaveButton,
} from "./components/StaffFormButtons";
import { useNavigate } from "react-router-dom";
import { isUserNonLoginUser, useUserApi, nonLoginUserRole } from "./helpers";
import { useMutation } from "@apollo/client";
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
import { ADD_NON_MOPED_USER } from "src/queries/staff";

export const initialFormValues = {
  first_name: "",
  last_name: "",
  title: "",
  email: "",
  password: "",
  workgroup: "",
  workgroup_id: "",
  roles: ["moped-editor"],
};

const newUserRoleOptions = [
  { value: nonLoginUserRole, name: "Non-login User" },
  { value: "moped-editor", name: "Editor" },
  { value: "moped-admin", name: "Admin" },
];

const validationSchema = yup.object().shape({
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  title: yup.string().required(),
  workgroup: yup.string().required(),
  workgroup_id: yup.string().required(),
  email: yup.string().required().email().lowercase(),
  // Password is not required for non-login users since they will not be added to Cognito user pool
  password: yup.string().when("roles", {
    is: (val) => val !== nonLoginUserRole,
    then: yup.string().required(),
  }),
  roles: yup.string().required(),
});

const NewStaffView = () => {
  let navigate = useNavigate();

  const { loading, requestApi, error, setError, setLoading } = useUserApi();
  const [addNonMopedUser] = useMutation(ADD_NON_MOPED_USER);

  /**
   * Submit create user request
   * @param {Object} data - The data returned from user form to submit to the Moped API
   */
  const onFormSubmit = (data) => {
    // Navigate to user table on successful add/edit
    const callback = () => navigate("/moped/staff");

    const isNonLoginUser = isUserNonLoginUser(data.roles);

    if (isNonLoginUser) {
      // Remove the password for the non-login user create mutation
      const { password, ...restOfData } = data;

      addNonMopedUser({
        variables: {
          object: restOfData,
        },
      }).then((res) => {
        const didUserCreateSuccessfully =
          res?.data?.insert_moped_users_one !== null;

        if (didUserCreateSuccessfully) {
          callback();
        } else {
          setError({
            email: ["A user with this email address already exists"],
          });
        }
      });
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
                roleOptions={newUserRoleOptions}
                FormButtons={({ isSubmitting, reset }) => (
                  <>
                    <StaffFormSaveButton disabled={isSubmitting} />
                    <StaffFormResetButton
                      onClick={() => reset(initialFormValues)}
                    />
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
