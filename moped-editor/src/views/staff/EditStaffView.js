import React from "react";
import { useParams } from "react-router-dom";
import StaffForm from "./StaffForm";

import {
  Box,
  Container,
  Card,
  CardHeader,
  CardContent,
  Divider,
  makeStyles,
} from "@material-ui/core";
import Page from "src/components/Page";

const useStyles = makeStyles(() => ({
  root: {},
}));

const USER_QUERY = id => gql`
  query GetUser {
    moped_users(
      where: { staff_uuid: { _eq: ${id} } }
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

  const { userData, userLoading, useError } = useQuery(USER_QUERY);
  if (userError) {
    console.log(userError);
  }

  return (
    <Page className={classes.root} title="Staff">
      <Container maxWidth={false}>
        <Box mt={3}>
          <Card className={classes.root}>
            <CardHeader title="Edit User" />
            <Divider />
            <CardContent>
              {userLoading ? <CircularProgress /> : <StaffForm data={} />}
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Page>
  );
};

export default EditStaffView;
