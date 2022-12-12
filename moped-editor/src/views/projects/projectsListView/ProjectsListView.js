import React from "react";
import { useLocation } from "react-router-dom";

// Material
import { makeStyles } from "@material-ui/core";
import Page from "src/components/Page";

// Abstract
import GQLAbstract from "../../../libs/GQLAbstract";
import ProjectsListViewTable from "./ProjectsListViewTable";
import { ProjectsListViewQueryConf } from "./ProjectsListViewQueryConf";

// Styles
const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100%",
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
  },
}));

/**
 * Load Query Configuration as a mutable object
 * @type {GQLAbstract}
 */
let projectsQuery = new GQLAbstract(ProjectsListViewQueryConf);

/**
 * Projects List View
 * @return {JSX.Element}
 * @constructor
 */
const ProjectsListView = () => {
  const classes = useStyles();
  const navSearchTerm = useLocation()?.state?.searchTerm;

  return (
    <Page className={classes.root} title="Projects">
      <ProjectsListViewTable
        title={"Projects"}
        query={projectsQuery}
        searchTerm={navSearchTerm}
      />
    </Page>
  );
};

export default ProjectsListView;
