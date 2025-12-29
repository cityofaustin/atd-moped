import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { CheckCircle, ContentCopy } from "@mui/icons-material";

// TODO:
// Update eCAPRIS subproject field to show the subproject id that is no longer a clickable link
// Update eCAPRIS subproject field with a clickable copy button with ContentCopy start icon
// Button copies eCAPRIS url in existing link code to the clipboard so it can be pasted in another tab (see CopyMugUsersButton for example code or VZ code)
// Button is outside ProjectSummaryLabel component so hover states don't overlap
// Button text updates from "COPY LINK" to "COPIED!" when clicked for feedback
// Button icon updates from ContentCopy to CheckCircle when clicked

/**
 * Button component which copies a link to clipboard
 * @param {string} linkToCopy - the link URL to be copied to clipboard
 * @param {string} copyButtonText - text to display on the button before copying
 * @param {string} copiedButtonText - text to display on the button after copying for feedback
 * @param {object} buttonProps - MUI Button props
 * @returns
 */
const CopyLinkButton = ({
  linkToCopy,
  copyButtonText = "Copy Link",
  copiedButtonText = "Copied!",
  buttonProps,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [copied]);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(linkToCopy);
    setCopied(true);
  };

  return (
    <Button
      size="small"
      onClick={handleCopyClick}
      {...buttonProps}
      startIcon={<ContentCopy />}
    >
      {copied ? copiedButtonText : copyButtonText}
    </Button>
  );
};

export default CopyLinkButton;
