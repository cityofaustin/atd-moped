import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { getExternalLinkText } from "src/utils/urls";

/**
 * ExternalLink component
 * @param {string} url - link url
 * @param {string} text - link text, optional but prioritized over url-based text when both are available
 * @param {boolean} useFriendlyUrl - whether to use friendly url text based on known url patterns, optional
 * @param {string} linkColor - color of the link
 * @param {Object} linkProps - Props supported by MUI Link to override defaults or set other options
 * @param {Boolean} stopPropagation - stop propagation of the click event from link click event or not
 * @param {Boolean} showExternalLinkIcon - show external link icon or not
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
}) => {
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
