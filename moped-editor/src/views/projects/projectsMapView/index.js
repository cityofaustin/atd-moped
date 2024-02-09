import React from "react";
import makeStyles from "@mui/styles/makeStyles";
import { ErrorBoundary } from "react-error-boundary";
import Page from "src/components/Page";
import ProjectsMap from "./ProjectsMap";
import FallbackComponent from "src/components/FallbackComponent";

const useStyles = makeStyles((theme) => ({
  content: {
    position: "relative",
    minHeight: "100%",
    margin: theme.spacing(2),
    boxShadow: "0 0 0 1px rgba(63,63,68,0.05),0 1px 2px 0 rgba(63,63,68,0.15)",
  },
}));

const ProjectsMapView = () => {
  const classes = useStyles();

  return (
    <Page className={classes.root} title="Projects Map">
      <ErrorBoundary FallbackComponent={FallbackComponent}>
        <main className={classes.content}>
          <div style={{ height: "85vh" }}>
            {/* Add drawer here */}
            <ProjectsMap />
          </div>
        </main>
      </ErrorBoundary>
    </Page>
  );
};

export default ProjectsMapView;
