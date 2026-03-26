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

// includes the error.message as the text in field 400 ("Describe the problem")
// and the email of the user logged in in field 406
export const createBugReportLink = (error, userEmail) => {
  return `https://atd.knack.com/dts#new-service-request/?view_249_vars=%7B%22field_398%22%3A%22Bug%20Report%20%E2%80%94%20Something%20is%20not%20working%22%2C%22field_399%22%3A%22Moped%22%2C%22field_400%22%3A%22${error.message}%22%2C%22field_406%22%3A%22${userEmail}%22%7D`;
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
