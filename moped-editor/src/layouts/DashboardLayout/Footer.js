import React from "react";
import { makeStyles, Typography } from "@material-ui/core";
import ExternalLink from "../../components/ExternalLink";
var pckg = require("../../../package.json");

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(4),
    paddingBottom: theme.spacing(2),
  },
  iconStyle: {
    fontSize: "14px",
    marginLeft: "2px",
    position: "relative",
    bottom: "-3px",
  },
}));

const Footer = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography variant="caption" color="textSecondary">
        Moped{" "}
        <ExternalLink
          // TODO: round this version number down to last minor release
          text={`v${pckg.version}`}
          url={`https://github.com/cityofaustin/atd-moped/releases/tag/v${pckg.version}`}
          linkColor="inherit"
          iconStyle={classes.iconStyle}
        />
      </Typography>
    </div>
  );
};

export default Footer;
