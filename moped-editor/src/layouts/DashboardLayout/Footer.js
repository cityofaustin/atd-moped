import React from "react";
import { Typography, Box } from "@mui/material";
import ExternalLink from "../../components/ExternalLink";

var pckg = require("../../../package.json");

const Footer = () => {
  return (
    <Box
      sx={{
        paddingTop: 1,
        paddingLeft: 4,
        paddingBottom: 2,
      }}
    >
      <Typography variant="caption" color="textSecondary">
        Moped{" "}
        <ExternalLink
          text={`v${pckg.version}`}
          url="https://github.com/cityofaustin/atd-moped/releases/latest"
          linkColor="inherit"
        />
      </Typography>
    </Box>
  );
};

export default Footer;
