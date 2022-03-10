import React from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@apollo/client";

// Material
import { makeStyles } from "@material-ui/core";
import Page from "src/components/Page";

// Abstract
import GQLAbstract from "../../../libs/GQLAbstract";
import GridTable from "../../../components/GridTable/GridTable";
import { ProjectsListViewQueryConf } from "./ProjectsListViewQueryConf";

import { STATUS_QUERY } from "../../../queries/project";

// Styles
const useStyles = makeStyles(theme => ({
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
  console.log("project list view");
  const classes = useStyles();
  const navSearchTerm = useLocation()?.state?.searchTerm;

  const { data } = useQuery(STATUS_QUERY);

    data?.moped_project.forEach(project => {
      if (project?.moped_proj_phases?.length) {
        console.log(project.moped_proj_phases[0]);
      }
      // Targeted Construction Start > moped_proj_phases where phase = Construction,
      // display the phase start date, otherwise leave blank
      // project["construction_start"] = null;
      // if (project?.moped_proj_phases?.length) {
      //   // check for construction phase
      //   const constructionPhase = project.moped_proj_phases.find(
      //     p => p.phase_name === "construction"
      //   );
      //   if (constructionPhase) {
      //     project["construction_start"] = constructionPhase.phase_start;
      //   }
      // }
    });

  return (
    <Page className={classes.root} title="Projects">
      <GridTable
        title={"Projects"}
        query={projectsQuery}
        searchTerm={navSearchTerm}
        referenceData={data}
      />
    </Page>
  );
};

export default ProjectsListView;
