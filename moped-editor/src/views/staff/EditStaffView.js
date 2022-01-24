import React from "react";
import { useQuery, gql } from "@apollo/client";
import { useParams } from "react-router-dom";
import StaffForm, { initialFormValues } from "./StaffForm";

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

const GET_USER = gql`
  query GetUser($userId: Int) {
    moped_users(where: { user_id: { _eq: $userId } }) {
      date_added
      first_name
      is_coa_staff
      last_name
      staff_uuid
      status_id
      title
      user_id
      workgroup
      workgroup_id
      cognito_user_id
      email
      roles
    }
  }
`;

const fieldFormatters = {
  status_id: id => id.toString(),
  workgroup_id: id => id.toString(),
  roles: roles => findHighestRole(roles),
};

const EditStaffView = () => {
  const classes = useStyles();
  const { userId } = useParams();

  const { data, loading, error } = useQuery(GET_USER, {
    variables: { userId },
  });
  if (error) {
    console.log(error);
  }

  const formatUserFormData = data => {
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
                      userCognitoId={data.moped_users[0].cognito_user_id}
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
