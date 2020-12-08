import React from "react";
import ProjectMap from "../projects/ProjectMap";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Box, Card, Container, makeStyles } from "@material-ui/core";
import Page from "src/components/Page";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const ProjectExtent = () => {
  const classes = useStyles();

  return (
    <Page className={classes.root} title="Staff">
      <Container maxWidth={false}>
        <Card>
          <PerfectScrollbar>
            <Box>
              <ProjectMap />
            </Box>
          </PerfectScrollbar>
        </Card>
      </Container>
    </Page>
  );
};

export default ProjectExtent;
