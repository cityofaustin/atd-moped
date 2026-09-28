import React from "react";
import { Typography, Box } from "@mui/material";
import ExternalLink from "../../components/ExternalLink";
import pckg from "../../../package.json";

const Footer = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 1,
        paddingLeft: 4,
        paddingRight: 4,
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
        <Typography
          variant="caption"
          color="textSecondary"
          sx={{ marginLeft: 1.5 }}
        >
          <ExternalLink
            text="Privacy Policy"
            url="https://github.com/cityofaustin/atd-moped/blob/main/PRIVACY.md"
            linkColor="inherit"
          />
        </Typography>
      </Typography>
      <Typography variant="caption" color="textSecondary">
        Built by{" "}
        <ExternalLink
          text="Data & Technology Services"
          url="https://austinmobility.io"
          linkColor="inherit"
        />
      </Typography>
    </Box>
  );
};

export default Footer;
