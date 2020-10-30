import React, { useState } from "react";
import { useApi, LOCAL_URI } from "./helpers";
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
