import React from "react";
import Link from "@material-ui/core/Link";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";

const ExternalLink = ({ url, text, linkColor }) => {
  return (
    <span>
      {!!text ? (
        <Link
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          color={linkColor ?? "primary"}
        >
          {text}
          <OpenInNewIcon style={{ fontSize: 16 }} />
        </Link>
      ) : (
        <span>-</span>
      )}
    </span>
  );
};

export default ExternalLink;
