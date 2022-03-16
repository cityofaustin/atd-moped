import React from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";

const useStyles = makeStyles(theme => ({
  iconStyle: {
    fontSize: "14px",
    marginLeft: "2px",
    position: "relative",
    bottom: "-3px",
  },
}));

const ExternalLink = ({ url, text, linkColor, underline, iconStyle }) => {
  const classes = useStyles();

  return (
    <span>
      {!!text ? (
        <Link
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          color={linkColor ?? "primary"}
          underline={underline ?? "hover"}
        >
          {text}
          <OpenInNewIcon
            // If iconStyle prop exists, use that override. Otherwise, use the
            // styles set in the makeStyles() above.
            className={iconStyle ? iconStyle : classes.iconStyle}
          />
        </Link>
      ) : (
        <span>-</span>
      )}
    </span>
  );
};

export default ExternalLink;
