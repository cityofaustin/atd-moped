import React from "react";
import { Link, Typography } from "@mui/material";
import ExternalLink from "src/components/ExternalLink";
import downloadFileAttachment from "src/utils/downloadFileAttachment";
import { isValidUrl } from "src/utils/urls";
import { cleanUpFileKey, clickableTextStyles } from "./ProjectFiles";
import { useUser } from "src/auth/user";

/**
 * Renders a file link based on the file type
 * @param {string} file_key S3 upload: clickable link that triggers a download
 * @param {string} file_url Valid URL: external link or Network path: monospace text block
 */
const ProjectFileLink = ({ file_key, file_url }) => {
  const { getCognitoSession } = useUser();

  if (file_key) {
    return (
      <Link
        onClick={() => downloadFileAttachment(file_key, getCognitoSession)}
        sx={clickableTextStyles}
      >
        {cleanUpFileKey(file_key)}
      </Link>
    );
  }

  if (isValidUrl(file_url)) {
    return (
      <ExternalLink
        linkProps={{ sx: clickableTextStyles }}
        url={file_url}
        showExternalLinkIcon={false}
      />
    );
  }

  return (
    <Typography
      sx={{
        backgroundColor: "#eee",
        fontFamily: "monospace",
        display: "block",
        wordWrap: "break-word",
        paddingLeft: "4px",
        paddingRight: "4px",
        fontSize: "14px",
      }}
    >
      {file_url}
    </Typography>
  );
};

export default ProjectFileLink;
