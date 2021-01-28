import React from "react";

// Material
import { makeStyles } from "@material-ui/core";
import Page from "src/components/Page";

// Abstract
import { GQLAbstract } from "atd-kickstand";
import GridTable from "../../../components/GridTable/GridTable";
import { ProjectsListViewQueryConf } from "./ProjectsListViewQueryConf";
import Toolbar from "./Toolbar";

// Styles
const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
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

  const toolbar = <Toolbar />;

  return (
    <Page className={classes.root} title="Projects">
      <GridTable
        title={"Projects"}
        query={projectsQuery}
        toolbar={toolbar}
      />
    </Page>
  );
};

export default ProjectsListView;
