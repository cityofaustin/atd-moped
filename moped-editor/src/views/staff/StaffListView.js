import React, { useState } from "react";

import {
  FormControlLabel,
  FormGroup,
  makeStyles,
  Switch,
} from "@material-ui/core";
import Page from "src/components/Page";

import { StaffListViewQueryConf } from "./StaffListViewQueryConf";
import GQLAbstract from "../../libs/GQLAbstract";
import GridTable from "../../components/GridTable/GridTable";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  switch: {
    marginTop: "1rem",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
}));

const StaffListView = () => {
  const classes = useStyles();

  const [showInactive, setShowInactive] = useState(false);

  /**
   * Override 'where' key based on state of 'showInactive'
   * @type {GQLAbstract}
   */
  const staffQuery = new GQLAbstract({
    ...StaffListViewQueryConf,
    ...(showInactive ? { where: {} } : {}),
  });

  /**
   * Toggles list of inactive users
   */
  const toggleShowInactive = () => {
    setShowInactive(!showInactive);
  };

  return (
    <Page className={classes.root} title="Staff">
      <GridTable
        title={"Staff"}
        query={staffQuery}
        toolbar={null}
        customComponents={{
          table: {
            before: (
              <FormGroup className={classes.switch}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showInactive}
                      onChange={toggleShowInactive}
                      color={"primary"}
                    />
                  }
                  labelPlacement="start"
                  label="Show Inactive Accounts"
                />
              </FormGroup>
            ),
          },
        }}
      />
    </Page>
  );
};

export default StaffListView;
