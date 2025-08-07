import React from "react";
import Link from "@mui/material/Link";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

/**
 * ExternalLink component
 * @param {string} url - link url
 * @param {string} text - link text
 * @param {string} linkColor - color of the link
 * @param {Object} linkProps - Props supported by MUI Link to override defaults or set other options
 * @param {Boolean} stopPropagation - stop propagation of the click event from link click event or not
 * @returns {JSX.Element}
 * @constructor
 */
const ExternalLink = ({
  url,
  text,
  linkColor,
  linkProps,
  stopPropagation = false,
}) => {
  return (
    <span
      onClick={(e) => {
        if (stopPropagation) {
          e.stopPropagation();
        }
      }}
    >
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
            sx={{
              fontSize: "1rem",
              marginLeft: "2px",
              position: "relative",
              bottom: "-3px",
            }}
          />
        </Link>
      ) : (
        <span>-</span>
      )}
    </span>
  );
};

export default ExternalLink;
