import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { CheckCircleOutline, ContentCopyOutlined } from "@mui/icons-material";

/**
 * Button component which copies text to clipboard
 * @param {string} textToCopy - the text to be copied to clipboard
 * @param {string} copyButtonText - text to display on the button before copying
 * @param {string} copiedButtonText - text to display on the button after copying for feedback
 * @param {object} buttonProps - MUI Button props
 * @param {object} iconProps - MUI Icon props
 * @param {number} timeoutDuration - duration in milliseconds before resetting copied state
 * @param {boolean} iconOnly - if true, renders an IconButton instead of a Button
 * @returns {JSX.Element} A button which copies a link to clipboard
 */
const CopyTextButton = ({
  textToCopy,
  copyButtonText = "Copy to Clipboard",
  copiedButtonText = "Copied!",
  buttonProps,
  iconProps,
  timeoutDuration = 2000,
  iconOnly = false,
}) => {
  const [copied, setCopied] = useState(false);
  const buttonText = copied ? copiedButtonText : copyButtonText;
  const startIcon = copied ? (
    <CheckCircleOutline {...iconProps} />
  ) : (
    <ContentCopyOutlined {...iconProps} />
  );

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
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

  if (iconOnly) {
    return (
      <Tooltip title={copied ? copiedButtonText : copyButtonText}>
        <IconButton
          size="small"
          onClick={handleCopyClick}
          aria-label={buttonText}
          {...buttonProps}
        >
          {startIcon}
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Button
      size="small"
      onClick={handleCopyClick}
      startIcon={startIcon}
      sx={{ minWidth: 100, justifyContent: "flex-start" }}
      aria-label={buttonText}
      {...buttonProps}
    >
      {buttonText}
    </Button>
  );
};

export default CopyTextButton;
