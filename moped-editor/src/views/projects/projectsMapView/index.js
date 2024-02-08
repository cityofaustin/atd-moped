import React from "react";
import makeStyles from "@mui/styles/makeStyles";
import { ErrorBoundary } from "react-error-boundary";
import Page from "src/components/Page";
import FallbackComponent from "src/components/FallbackComponent";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100%",
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
  },
}));

const ProjectsMapView = () => {
  const classes = useStyles();

  return (
    <Page className={classes.root} title="Projects">
      <ErrorBoundary FallbackComponent={FallbackComponent}>
        <>Map View</>
      </ErrorBoundary>
    </Page>
  );
};

export default ProjectsMapView;
