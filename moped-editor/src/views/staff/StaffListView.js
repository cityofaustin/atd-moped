import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

import {
  Box,
  Container,
  makeStyles,
  CircularProgress,
} from "@material-ui/core";
import Page from "src/components/Page";
import StaffTable from "./StaffTable";
import Toolbar from "./Toolbar";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const GET_STAFF = gql`
  query GetStaff {
    moped_users {
      cognito_user_id
      date_added
      first_name
      last_name
      staff_uuid
      title
      workgroup
      workgroup_id
      user_id
      is_coa_staff
      status_id
    }
  }
`;

const StaffListView = () => {
  const classes = useStyles();

  const { data, loading, error } = useQuery(GET_STAFF, {
    fetchPolicy: "no-cache",
  });
  if (error) {
    console.log(error);
  }

  return (
    <Page className={classes.root} title="Staff">
      <Container maxWidth={false}>
        <Toolbar />
        <Box mt={3}>
          {loading ? (
            <CircularProgress />
          ) : (
            <StaffTable staff={data.moped_users} />
          )}
        </Box>
      </Container>
    </Page>
  );
};

export default StaffListView;
