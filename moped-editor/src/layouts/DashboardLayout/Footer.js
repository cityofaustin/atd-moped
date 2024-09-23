import React from "react";
import { Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import ExternalLink from "../../components/ExternalLink";

var pckg = require("../../../package.json");

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(4),
    paddingBottom: theme.spacing(2),
  },
}));

const Footer = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="caption" color="textSecondary">
        Moped{" "}
        <ExternalLink
          text={`v${pckg.version}`}
          url="https://github.com/cityofaustin/atd-moped/releases/latest"
          linkColor="inherit"
        />
      </Typography>
    </div>
  );
};

export default Footer;
