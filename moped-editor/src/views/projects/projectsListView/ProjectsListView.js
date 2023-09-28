import React from "react";
import { useLocation } from "react-router-dom";

import makeStyles from "@mui/styles/makeStyles";
import Page from "src/components/Page";

// Abstract
import GQLAbstract from "../../../libs/GQLAbstract";

import { PROJECT_LIST_VIEW_QUERY_CONFIG } from "./ProjectsListViewQueryConf";
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
 * Load Query Configuration as a mutable object
 * @type {GQLAbstract}
 */
let projectsQuery = new GQLAbstract(PROJECT_LIST_VIEW_QUERY_CONFIG);

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
