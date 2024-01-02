import React from "react";
import makeStyles from "@mui/styles/makeStyles";
import { ErrorBoundary } from "react-error-boundary";
import Page from "src/components/Page";
import ProjectsListViewTable from "./ProjectsListViewTable";
import FallbackComponent from "src/components/FallbackComponent";

// Styles
const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100%",
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
  },
}));

/**
 * Projects List View
 * @return {JSX.Element}
 * @constructor
 */
const ProjectsListView = () => {
  const classes = useStyles();

  return (
    <Page className={classes.root} title="Projects">
      <ErrorBoundary FallbackComponent={FallbackComponent}>
        <ProjectsListViewTable title={"Projects"} />
      </ErrorBoundary>
    </Page>
  );
};

export default ProjectsListView;
