import React from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@apollo/client";

// Material
import { makeStyles } from "@material-ui/core";
import Page from "src/components/Page";

// Abstract
import GQLAbstract from "../../libs/GQLAbstract";
import GridTable from "../../components/GridTable/GridTable";
import { DashboardViewQueryConf } from "./DashboardViewQueryConf";

import { STATUS_QUERY } from "../../queries/project";

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
let dashboardQuery = new GQLAbstract(DashboardViewQueryConf);

/**
 * Dashboard View
 * @return {JSX.Element}
 * @constructor
 */
const DashboardView = () => {
  const classes = useStyles();
  const navSearchTerm = useLocation()?.state?.searchTerm;

  const { data } = useQuery(STATUS_QUERY);

  return (
    <Page className={classes.root} title="Dashboard">
      <GridTable
        title={"Dashboard"}
        query={dashboardQuery}
        searchTerm={navSearchTerm}
        referenceData={data}
      />
    </Page>
  );
};

export default DashboardView;
