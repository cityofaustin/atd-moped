import React from "react";
import Link from "@material-ui/core/Link";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";

const ExternalLink = ({
  url,
  text,
  linkColor,
  underline,
  iconStyle = { fontSize: 16 },
}) => {
  console.log(iconStyle);
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
          <OpenInNewIcon className={iconStyle} />
        </Link>
      ) : (
        <span>-</span>
      )}
    </span>
  );
};

export default ExternalLink;
