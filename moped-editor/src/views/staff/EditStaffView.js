import React from "react";
import { useQuery } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import StaffForm, { initialFormValues } from "./StaffForm";
import { useUserApi } from "./helpers";
import { GET_USER } from "src/queries/staff";

import {
  Box,
  Container,
  Card,
  CardHeader,
  CardContent,
  CircularProgress,
  Divider,
  makeStyles,
} from "@material-ui/core";
import Page from "src/components/Page";
import { findHighestRole } from "../../auth/user";
import NotFoundView from "../errors/NotFoundView";

const useStyles = makeStyles(() => ({
  root: {},
}));

const fieldFormatters = {
  workgroup_id: (id) => id.toString(),
  roles: (roles) => findHighestRole(roles),
};

const EditStaffView = () => {
  const classes = useStyles();
  const { userId } = useParams();
  let navigate = useNavigate();

  /**
   * Make use of the useUserApi to retrieve the requestApi function and
   * api request loading state and errors from the api.
   */
  const {
    loading: userApiLoading,
    requestApi,
    error: apiErrors,
    setError,
    setLoading,
  } = useUserApi();

  const { data, loading, error } = useQuery(GET_USER, {
    variables: { userId },
  });
  if (error) {
    console.log(error);
  }
  const userCognitoId = data?.moped_users[0]?.cognito_user_id;

  const formatUserFormData = (data) => {
    // Format to types required by MUI form components
    Object.entries(fieldFormatters).forEach(([fieldName, formatter]) => {
      const originalValue = data[fieldName];

      if (originalValue !== undefined) {
        const formattedValue = formatter(originalValue);
        data = { ...data, [fieldName]: formattedValue };
      }
    });

    // If Hasura doesn't return a field, set to default
    Object.entries(initialFormValues).forEach(([field, value]) => {
      if (data[field] === undefined) {
        data = { ...data, [field]: value };
      }
    });

    return data;
  };

  /**
   * Controls the onSubmit data event
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
      {data && !data?.moped_users?.length && <NotFoundView />}
      {data && !!data?.moped_users?.length && (
        <Page className={classes.root} title="Staff">
          <Container maxWidth={false}>
            <Box mt={3}>
              <Card className={classes.root}>
                <CardHeader title="Edit User" />
                <Divider />
                <CardContent>
                  {loading ? (
                    <CircularProgress />
                  ) : (
                    <StaffForm
                      editFormData={formatUserFormData(data.moped_users[0])}
                      userCognitoId={userCognitoId}
                      onFormSubmit={onFormSubmit}
                      apiErrors={apiErrors}
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
