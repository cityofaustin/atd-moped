import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Container,
  makeStyles,
  CircularProgress,
} from "@material-ui/core";
import Page from "src/components/Page";
import Results from "./StaffTable";
import Toolbar from "./Toolbar";

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

const StaffListView = () => {
  const classes = useStyles();
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios({
      url: "",
      method: "post",
      data: {
        query: staffQuery,
      },
    }).then(result => {
      const staffArray = result.data.data.moped_coa_staff;
      setStaff(staffArray);
      setLoading(false);
    });
  }, []);

  return (
    <Page className={classes.root} title="Staff">
      <Container maxWidth={false}>
        <Toolbar />
        <Box mt={3}>
          {loading || staff === null ? (
            <CircularProgress />
          ) : (
            <Results staff={staff} />
          )}
        </Box>
      </Container>
    </Page>
  );
};

export default StaffListView;
