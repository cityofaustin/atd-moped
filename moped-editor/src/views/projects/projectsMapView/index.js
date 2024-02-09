import React from "react";
import makeStyles from "@mui/styles/makeStyles";
import Paper from "@mui/material/Paper";
import { ErrorBoundary } from "react-error-boundary";
import Page from "src/components/Page";
import ProjectsMap from "./ProjectsMap";
import FallbackComponent from "src/components/FallbackComponent";

const useStyles = makeStyles((theme) => ({
  content: {
    position: "relative",
    minHeight: "100%",
    margin: theme.spacing(2),
  },
}));

const ProjectsMapView = () => {
  const classes = useStyles();

  return (
    <Page className={classes.root} title="Projects Map">
      <ErrorBoundary FallbackComponent={FallbackComponent}>
        <main className={classes.content}>
          <Paper>
            <div style={{ height: "85vh" }}>
              {/* Add drawer here */}
              <ProjectsMap />
            </div>
          </Paper>
        </main>
      </ErrorBoundary>
    </Page>
  );
};

export default ProjectsMapView;
