import Box from "@mui/material/Box";
import Link, { type LinkProps } from "@mui/material/Link";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { getExternalLinkText } from "src/utils/urls";

interface ExternalLinkProps {
  /** link url */
  url: LinkProps["href"]
  /** link text, optional but prioritized over url-based text when both are available */
  text?: string | null;
  /**  whether to use friendly url text based on known url patterns, optional, defaults to false */
  useFriendlyUrl?: boolean;
  /** color of the link */
  linkColor: LinkProps["color"];
  /** Props supported by MUI Link to override defaults or set other options */
  linkProps?: LinkProps;
  /** Stop propagation of the click event from link click event or not, defaults to false */
  stopPropagation?: boolean;
  /** show external link icon or not, defaults to true*/
  showExternalLinkIcon?: boolean;
}

/**
 * ExternalLink component

 * @returns {JSX.Element}
 * @constructor
 */
const ExternalLink = ({
  url,
  text = null,
  useFriendlyUrl = false,
  linkColor,
  linkProps,
  stopPropagation = false,
  showExternalLinkIcon = true,
}: ExternalLinkProps) => {
  /* Prefer friendly text if useFriendlyUrl is true, then fallback to the text prop, and finally to the URL */
  const friendlyText = useFriendlyUrl ? getExternalLinkText(url) : null;
  const displayText = friendlyText || text || url;

  return (
    <Box
      component="span"
      onClick={(e) => {
        if (stopPropagation) {
          e.stopPropagation();
        }
      }}
      sx={{ overflow: "hidden", minWidth: 0 }}
    >
      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        color={linkColor ?? "primary"}
        variant="body2"
        title={url}
        {...linkProps}
      >
        {displayText}
        {showExternalLinkIcon && (
          <OpenInNewIcon
            sx={{
              fontSize: "1rem",
              marginLeft: "2px",
              position: "relative",
              bottom: "-3px",
            }}
          />
        )}
      </Link>
    </Box>
  );
};

export default ExternalLink;
