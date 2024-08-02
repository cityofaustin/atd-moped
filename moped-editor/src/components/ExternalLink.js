import React from "react";
import Link from "@mui/material/Link";
import makeStyles from "@mui/styles/makeStyles";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const useStyles = makeStyles(() => ({
  iconStyle: {
    fontSize: "1rem",
    marginLeft: "2px",
    position: "relative",
    bottom: "-3px",
  },
}));

/**
 * ExternalLink component
 * @param {string} url - link url
 * @param {string} text - link text
 * @param {string} linkColor - color of the link
 * @param {Object} linkProps - Props supported by MUI Link to override defaults or set other options
 * @returns {JSX.Element}
 * @constructor
 */
const ExternalLink = ({ url, text, linkColor, iconStyle, linkProps }) => {
  const classes = useStyles();

  return (
    <span>
      {!!text ? (
        <Link
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          color={linkColor ?? "primary"}
          {...linkProps}
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
