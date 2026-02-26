import React from "react";
import Link from "@mui/material/Link";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

// Returns link text based on url when no text prop is provided, can be expanded to include more cases as needed
const getExternalLinkText = (url) => {
  switch (true) {
    case url.toLowerCase().includes("https://atd.knack.com/amd"):
      return "AMD Data Tracker";
    case url.toLowerCase().includes("https://atd.knack.com/signs-markings"):
      return "Signs & Markings";
    default:
      return "Open";
  }
};

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
      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        color={linkColor ?? "primary"}
        {...linkProps}
      >
        {text || getExternalLinkText(url)}
        <OpenInNewIcon
          sx={{
            fontSize: "1rem",
            marginLeft: "2px",
            position: "relative",
            bottom: "-3px",
          }}
        />
      </Link>
    </span>
  );
};

export default ExternalLink;
