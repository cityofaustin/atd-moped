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

const EditStaffView = () => {
  const classes = useStyles();
  const { id } = useParams();

  const { userData, userLoading, userError } = useQuery(USER_QUERY);
  if (userError) {
    console.log(userError);
  }
  console.log(userData);

  return (
    <Page className={classes.root} title="Staff">
      <Container maxWidth={false}>
        <Box mt={3}>
          <Card className={classes.root}>
            <CardHeader title="Edit User" />
            <Divider />
            <CardContent>
              {/* {userLoading ? (
                <CircularProgress />
              ) : (
                <StaffForm editFormData={userData.moped_users[0]} />
              )} */}
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Page>
  );
};

export default EditStaffView;
