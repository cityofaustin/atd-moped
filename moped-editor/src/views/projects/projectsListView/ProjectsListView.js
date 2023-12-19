//'use client'
import React from "react";
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

/**
 * Projects List View
 * @return {JSX.Element}
 * @constructor
 */
const ProjectsListView = () => {
  const classes = useStyles();

  return (
    <Page className={classes.root} title="Projects">
      <ProjectsListViewTable title={"Projects"} />
    </Page>
  );
};

export default ProjectsListView;
