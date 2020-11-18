import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { useParams } from "react-router-dom";
import { gql } from "apollo-boost";
import StaffForm from "./StaffForm";

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

const useStyles = makeStyles(() => ({
  root: {},
}));

const USER_QUERY = gql`
  query GetUser {
    moped_users(
      where: { staff_uuid: { _eq: "9699d49f-c5ba-4dad-b286-510a5e178aa7" } }
    ) {
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
    }
  }
`;

const fieldFormatters = {
  status_id: id => id.toString(),
  workgroup_id: id => id.toString(),
  roles: role => role[0],
};

const EditStaffView = () => {
  const classes = useStyles();
  const { id } = useParams();

  const { data, loading, error } = useQuery(USER_QUERY);
  if (error) {
    console.log(error);
  }

  const formatUserFormData = data => {
    Object.entries(fieldFormatters).forEach(([fieldName, formatter]) => {
      const originalValue = data[fieldName];

      if (originalValue !== undefined) {
        const formattedValue = formatter(originalValue);

        data[fieldName] = formattedValue;
      }
    });

    return data;
  };

  return (
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
                />
              )}
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Page>
  );
};

export default EditStaffView;
