import React from "react";
import Link from "@material-ui/core/Link";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";

const ExternalLink = ({ url, text }) => {
  return (
    <div>
      <Link href={url} target="_blank" rel="noopener noreferrer">
        {text}
          <OpenInNewIcon style={{ fontSize: 16 }} />
      </Link>
    </div>
  );
};

export default ExternalLink;
