import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Container, makeStyles } from "@material-ui/core";
import Page from "src/components/Page";
import Results from "./Results";
import Toolbar from "./Toolbar";
import data from "./data";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const staffQuery = `
  query GetStaff {
    moped_coa_staff {
      cognito_user_id
      date_added
      first_name
      full_name
      last_name
      staff_id
      staff_uuid
      title
      workgroup
      workgroup_id
    }
  }
`;

const CustomerListView = () => {
  const classes = useStyles();
  const [staff, setStaff] = useState(data);

  useEffect(() => {
    axios({
      url: "",
      method: "post",
      data: {
        query: staffQuery,
      },
    }).then(result => {
      const staffArray = result.data.data.moped_coa_staff;
      setStaff(staffArray);
    });
  }, []);

  return (
    <Page className={classes.root} title="Customers">
      <Container maxWidth={false}>
        <Toolbar />
        <Box mt={3}>
          <Results staff={staff} />
        </Box>
      </Container>
    </Page>
  );
};

export default CustomerListView;
