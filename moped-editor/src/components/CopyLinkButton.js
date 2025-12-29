import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { CheckCircleOutline, ContentCopyOutlined } from "@mui/icons-material";

// TODO:
// Update eCAPRIS subproject field to show the subproject id that is no longer a clickable link
// Update eCAPRIS subproject field with a clickable copy button with ContentCopy start icon
// Button copies eCAPRIS url in existing link code to the clipboard so it can be pasted in another tab (see CopyMugUsersButton for example code or VZ code)
// Button is outside ProjectSummaryLabel component so hover states don't overlap

/**
 * Button component which copies a link to clipboard
 * @param {string} linkToCopy - the link URL to be copied to clipboard
 * @param {string} copyButtonText - text to display on the button before copying
 * @param {string} copiedButtonText - text to display on the button after copying for feedback
 * @param {object} buttonProps - MUI Button props
 * @param {number} timeoutDuration - duration in milliseconds before resetting copied state
 * @returns {JSX.Element} A button which copies a link to clipboard
 */
const CopyLinkButton = ({
  linkToCopy,
  copyButtonText = "Copy Link",
  copiedButtonText = "Copied!",
  buttonProps,
  timeoutDuration = 2000,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(linkToCopy);
      setCopied(true);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  /* Reset copied state after timeout */
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false);
      }, timeoutDuration);

      return () => clearTimeout(timeout);
    }
  }, [copied, timeoutDuration]);

  return (
    <Button
      size="small"
      onClick={handleCopyClick}
      startIcon={copied ? <CheckCircleOutline /> : <ContentCopyOutlined />}
      sx={{ minWidth: 100, justifyContent: "flex-start" }}
      aria-label={
        copied ? copiedButtonText : `${copyButtonText}: ${linkToCopy}`
      }
      {...buttonProps}
    >
      {copied ? copiedButtonText : copyButtonText}
    </Button>
  );
};

export default CopyLinkButton;
