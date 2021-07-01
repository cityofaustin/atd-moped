import React from "react";
import { makeStyles, Typography } from "@material-ui/core";
import ExternalLink from "../../components/ExternalLink";
var pckg = require("../../../package.json");

const useStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(4),
    paddingBottom: theme.spacing(2),
  },
}));

const Footer = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography variant="caption" color="textSecondary">
        Moped {" "}
        <ExternalLink
          text={`v${pckg.version}`}
          url={`https://github.com/cityofaustin/atd-moped/releases/tag/v${pckg.version}`}
          linkColor="inherit"
        />
      </Typography>
    </div>
  );
};

export default Footer;
