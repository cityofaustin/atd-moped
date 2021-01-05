import React from "react";
import Can from "../../auth/Can";
import { getHighestRole, useUser } from "../../auth/user";
import { useQuery } from "@apollo/react-hooks";

import {
  Box,
  Container,
  makeStyles,
  CircularProgress,
} from "@material-ui/core";
import Page from "src/components/Page";
import StaffTable from "./StaffTable";
import Toolbar from "./Toolbar";
import { GQLAbstract } from "atd-kickstand";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const staffQueryConf = {
  table: "moped_users",
  single_item: "staff",
  showDateRange: false,
  columns: {
    cognito_user_id: {
      primary_key: true,
      searchable: false,
      sortable: false,
      label_search: "Search by Cognito User ID",
      label_table: "Cognito User ID",
      type: "String",
    },
    date_added: {
      searchable: false,
      sortable: false,
      label_search: "Search by Date Added",
      label_table: "Cognito User ID",
      type: "String",
    },
    first_name: {
      searchable: false,
      sortable: false,
      label_search: "Search by First Name",
      label_table: "First Name",
      type: "String",
    },
    last_name: {
      searchable: false,
      sortable: false,
      label_search: "Search by Last Name",
      label_table: "Last Name",
      type: "String",
    },
    staff_uuid: {
      searchable: false,
      sortable: false,
      label_search: "Search by Staff UUID",
      label_table: "Staff UUID",
      type: "String",
    },
    title: {
      searchable: false,
      sortable: false,
      label_search: "Search by Title",
      label_table: "Title",
      type: "String",
    },
    workgroup: {
      searchable: false,
      sortable: false,
      label_search: null,
      label_table: "Workgroup",
      type: "String",
    },
    workgroup_id: {
      searchable: false,
      sortable: false,
      label_search: null,
      label_table: "Workgroup ID",
      type: "Int",
    },
    user_id: {
      searchable: false,
      sortable: false,
      label_search: null,
      label_table: "Cognito User ID",
      type: "Int",
    },
    is_coa_staff: {
      searchable: false,
      sortable: false,
      label_search: null,
      label_table: "COA Staff",
      type: "Boolean",
    },
    status_id: {
      searchable: false,
      sortable: false,
      label_search: null,
      label_table: "Status ID",
      type: "Boolean",
    },
  },
  order_by: {},
  where: {},
  limit: 25,
  offset: 0,
};

let staffQuery = new GQLAbstract(staffQueryConf);

const StaffListView = () => {
  const classes = useStyles();
  const { data, loading, error } = useQuery(staffQuery.gql);
  const { user } = useUser();

  if (error) {
    console.log(error);
  }

  if (data) {
    console.log(staffQuery.query);
  }

  return (
    <Page className={classes.root} title="Staff">
      <Container maxWidth={false}>
        <Can
          role={getHighestRole(user)}
          perform="user:create"
          yes={<Toolbar />}
        />
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
