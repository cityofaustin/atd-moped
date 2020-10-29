import React from "react";
import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";
import Page from "src/components/Page";
import {
  Box,
  Card,
  Container,
  Grid,
  makeStyles,
  Link,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const NewProjectView = () => {
  const classes = useStyles();

  return (
    <Page className={classes.root} title="New Project">
      <Container maxWidth={false}>
        <Card>
          <Typography color="textPrimary" gutterBottom variant="h2">
            New Project View
          </Typography>
        </Card>
      </Container>
    </Page>
  );
};

export default NewProjectView;
