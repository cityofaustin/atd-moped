import React, { useState, useEffect } from "react";
import { useUser } from "../../../auth/user";
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

// Use local API dev server for now
const LOCAL_URI = `http://127.0.0.1:5000`;

// Custom Hook for API calls
function useApi(url) {
  const [result, setResult] = useState();
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const getToken = user => user && user.signInUserSession.idToken.jwtToken;

  const token = getToken(user);

  const headers = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    setLoading(true);
    axios.get(url, headers).then(res => {
      setResult(res.data);
      setLoading(false);
    });
  }, [url]);

  return [result, loading];
}

const CustomerListView = () => {
  const classes = useStyles();
  const [staff] = useState(data);

  const [result, loading] = useApi(`${LOCAL_URI}/users/`);
  console.log(result);

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
