import React from "react";
import { Typography } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
  label: {
    fontSize: "1rem",
    color: theme.palette.grey["600"],
  },
}));

/**
 *
 * @param {String} label - Whatever the label should say
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectSummaryLabel = ({ label }) => {
  const classes = useStyles();
  return <Typography className={classes.label}>{label}</Typography>;
};

export default ProjectSummaryLabel;
