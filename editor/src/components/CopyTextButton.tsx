import { useEffect, useState } from "react";
import Button, { type ButtonProps } from "@mui/material/Button";
import { CheckCircleOutlined, ContentCopyOutlined } from "@mui/icons-material";
import { type SvgIconProps, type IconButtonProps } from "@mui/material";
import IconButtonWithTooltip from "src/components/IconButtonWithTooltip";

interface CopyTextButtonProps {
  /** the text to be copied to clipboard */
  textToCopy: string;
  /** text to display on the button before copying */
  copyButtonText?: string;
  /** text to display on the button after copying for feedback */
  copiedButtonText?: string;
  /**  MUI Button props */
  buttonProps?: ButtonProps;
  /** MUI IconButton props */
  iconButtonProps?: IconButtonProps;
  /**  MUI Icon props */
  iconProps?: SvgIconProps;
  /**  duration in milliseconds before resetting copied state */
  timeoutDuration?: number;
  /** if true, renders an IconButton instead of a Button */
  iconOnly?: boolean;
}

/**
 * Button component which copies text to clipboard
 */
const CopyTextButton = ({
  textToCopy,
  copyButtonText = "Copy to clipboard",
  copiedButtonText = "Copied!",
  buttonProps,
  iconButtonProps,
  iconProps,
  timeoutDuration = 2000,
  iconOnly = false,
}: CopyTextButtonProps) => {
  const [copied, setCopied] = useState(false);
  const buttonText = copied ? copiedButtonText : copyButtonText;
  const startIcon = copied ? (
    <CheckCircleOutlined color="success" {...iconProps} />
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
      <IconButtonWithTooltip
        title={copied ? copiedButtonText : copyButtonText}
        onClick={handleCopyClick}
        ariaLabel={buttonText}
        iconButtonProps={iconButtonProps}
      >
        {startIcon}
      </IconButtonWithTooltip>
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
