import React from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import ExternalLink from "src/components/ExternalLink";
import CopyTextButton from "src/components/CopyTextButton";
import downloadFileAttachment from "src/utils/downloadFileAttachment";
import { isValidUrl } from "src/utils/urls";
import { cleanUpFileKey } from "./ProjectFiles";
import { useUser } from "src/auth/user";

/**
 * Renders a file link based on the file type
 * @param {string} fileKey S3 upload: clickable link that triggers a download
 * @param {string} fileUrl Valid URL: external link or Network path: monospace text block
 * @param {string} fileName Name of the file
 * @param {boolean} condensed Whether to display a condensed version of the file link
 */
const ProjectFileLink = ({ fileKey, fileUrl, fileName, condensed = false }) => {
  const { getCognitoSession } = useUser();

  /* Download file */
  if (fileKey) {
    const displayName = cleanUpFileKey(fileKey);
    return (
      <Link
        onClick={() => downloadFileAttachment(fileKey, getCognitoSession)}
        noWrap={condensed}
        sx={
          condensed
            ? {
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }
            : null
        }
        title={displayName}
      >
        {displayName}
      </Link>
    );
  }

  /* Show url to file */
  if (isValidUrl(fileUrl)) {
    return (
      <ExternalLink
        linkProps={{
          sx: {
            cursor: "pointer",
            overflow: "hidden",
            display: "block",
            textOverflow: "ellipsis",
            ...(condensed && { minWidth: 0 }),
          },
          noWrap: condensed,
          title: fileName,
        }}
        url={fileUrl}
        text={fileName}
        showExternalLinkIcon={false}
      />
    );
  }

  /* Show network path or invalid url as monospace text */
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Typography
        noWrap={condensed}
        sx={{
          backgroundColor: "#eee",
          fontFamily: "monospace",
          fontSize: "14px",
          px: 0.5,
          flexShrink: 1,
          minWidth: 0,
          ...(condensed
            ? {
                overflow: "hidden",
                textOverflow: "ellipsis",
                cursor: "default",
              }
            : { display: "block", wordWrap: "break-word" }),
        }}
        title={fileUrl}
      >
        {fileUrl}
      </Typography>
      <CopyTextButton
        textToCopy={fileUrl}
        buttonProps={{ size: "small" }}
        iconProps={{ fontSize: "small" }}
        iconOnly
      />
    </Box>
  );
};

export default ProjectFileLink;
