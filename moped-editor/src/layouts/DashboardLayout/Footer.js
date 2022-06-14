import React, { useEffect, useState } from "react";
import { makeStyles, Typography } from "@material-ui/core";
import ExternalLink from "../../components/ExternalLink";
import { get } from "lodash";

var pckg = require("../../../package.json");


const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(4),
    paddingBottom: theme.spacing(2),
  },
}));

const Footer = () => {
  const classes = useStyles();
  const [mostRecentTag, setMostRecentTag] = useState(`v${pckg.version}`); // use default tag

  useEffect(() => {
    getMostRecentGithubTags();
  });

  /**
   * Async function that updates the mostRecentTag state based on API callto Github "tag" endpoint
   */
  const getMostRecentGithubTags = async () => {
    const githubTagsApiEndpoint =
      "https://api.github.com/repos/cityofaustin/atd-moped/tags";
    const response = await fetch(githubTagsApiEndpoint);
    const data = await response.json();
    if (get(data, 0)) {
      setMostRecentTag(data[0].name);
    } else {
      setMostRecentTag(`v${pckg.version}`)
    }
  };

  return (
    <div className={classes.root}>
      <Typography variant="caption" color="textSecondary">
        Moped{" "}
        <ExternalLink
          text={`v${pckg.version}`}
          url={`https://github.com/cityofaustin/atd-moped/releases/tag/${mostRecentTag}`}
          linkColor="inherit"
        />
      </Typography>
    </div>
  );
};

export default Footer;
