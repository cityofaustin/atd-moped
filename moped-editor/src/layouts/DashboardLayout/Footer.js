import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import ExternalLink from "../../components/ExternalLink";
import { get } from "lodash";

var pckg = require("../../../package.json");

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(4),
    paddingBottom: theme.spacing(2),
  },
}));

/**
 * Async function that retrieves most recent tag from an API call to Github "tag" endpoint
 */
const getMostRecentGithubTags = async () => {
  const githubTagsApiEndpoint =
    "https://api.github.com/repos/cityofaustin/atd-moped/tags";
  const response = await fetch(githubTagsApiEndpoint);
  const data = await response.json();
  if (get(data, 0)) {
    return data[0].name;
  } else {
    return `v${pckg.version}`;
  }
};

const Footer = () => {
  const classes = useStyles();
  const [mostRecentTag, setMostRecentTag] = useState(`v${pckg.version}`); // use default tag

  useEffect(() => {
    const tag = getMostRecentGithubTags();
    setMostRecentTag(tag);
  }, []);

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
