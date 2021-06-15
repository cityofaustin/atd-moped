import React, { useState } from "react";
import { Box, Container, makeStyles } from "@material-ui/core";
import Page from "src/components/Page";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const DeviasStyleView = () => {
  const classes = useStyles();
  // const [customers] = useState(data);

  return (
    <Page className={classes.root} title="Devias Custom Styles">
      <Container maxWidth={false}>
        {"hi"}
      </Container>
    </Page>
  );
};

export default DeviasStyleView;
