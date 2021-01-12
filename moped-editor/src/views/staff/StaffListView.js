import React from "react";

import { makeStyles } from "@material-ui/core";
import Page from "src/components/Page";

import { StaffListViewQueryConf } from "./StaffListViewQueryConf";
import { GQLAbstract } from "atd-kickstand";
import GridTable from "../../components/GridTable/GridTable";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

let staffQuery = new GQLAbstract(StaffListViewQueryConf);

const StaffListView = () => {
  const classes = useStyles();

  return (
    <Page className={classes.root} title="Staff">
      <GridTable title={"Staff"} query={staffQuery} toolbar={null} />
    </Page>
  );
};

export default StaffListView;
