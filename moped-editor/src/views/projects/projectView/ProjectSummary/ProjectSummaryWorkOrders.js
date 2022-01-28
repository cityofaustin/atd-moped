import React, { useState } from "react";
import {
  Box,
  Grid,
  Icon,
  Link,
  TextField,
  Typography,
} from "@material-ui/core";

import ProjectSummaryLabel from "./ProjectSummaryLabel";

import { OpenInNew } from "@material-ui/icons";

/**
 * ProjectSummaryWorkOrders Component
 * @param {Number} projectId - The id of the current project being viewed
 * @param {Object} data - The data object from the GraphQL query
 * @param {function} refetch - The refetch function from apollo
 * @param {Object} classes - The shared style settings
 * @param {function} snackbarHandle - The function to show the snackbar
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectSummaryWorkOrders = ({
  projectId,
  data,
  refetch,
  classes,
  snackbarHandle,
}) => {

  return (
    <Grid item xs={12} className={classes.fieldGridItem}>
      <Typography className={classes.fieldLabel}>Work orders</Typography>
      <Box
        display="flex"
        justifyContent="flex-start"
        className={classes.fieldBox}
      >
          <ProjectSummaryLabel
            className={classes.fieldLabelLink}
            text={
                <Link className={classes.fieldLabelText} href={'/'} target={"_blank"}>
                  {"View in Data Tracker"}
                  <OpenInNew className={classes.linkIcon} />
                </Link>
            }
            classes={classes}
            spanClassName={""}
          />
      </Box>
    </Grid>
  );
};

export default ProjectSummaryWorkOrders;
