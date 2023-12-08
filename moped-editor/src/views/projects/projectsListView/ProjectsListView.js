'use client'
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import makeStyles from "@mui/styles/makeStyles";
import Page from "src/components/Page";
import ProjectsListViewTable from "./ProjectsListViewTable";

// Styles
const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100%",
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
  },
}));

const fallbackRender= ({ error, resetErrorBoundary }) => {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
    </div>
  );
}

/**
 * Projects List View
 * @return {JSX.Element}
 * @constructor
 */
const ProjectsListView = () => {
  const classes = useStyles();

  return (
    <Page className={classes.root} title="Projects">
      <ErrorBoundary fallbackRender={fallbackRender}>
        <ProjectsListViewTable title={"Projects"} />
      </ErrorBoundary>
    </Page>
  );
};

export default ProjectsListView;
