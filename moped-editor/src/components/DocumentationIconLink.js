import { Link as RouterLink } from "react-router-dom";
import { Tooltip } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import MenuBookOutlined from "@mui/icons-material/MenuBookOutlined";

/**
 * Documentation icon link component for pointing to documentation or data dictionary
 *
 * @param {string} tooltipText - Tooltip text displayed on hover
 * @param {string} documentationLink - Link to documentation
 * @param {string} size - MUI size variant of the icon button (small, medium, large)
 * @param {object} iconButtonSx - Optional sx styling for the IconButton
 */
const DocumentationIconLink = ({
  tooltipText = "View documentation",
  documentationLink,
  size = "small",
  iconButtonSx = {},
}) => (
  <Tooltip title={tooltipText}>
    <Link
      component={RouterLink}
      to={documentationLink}
      target="_blank"
      underline="none"
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <IconButton sx={iconButtonSx} color="inherit" size={size}>
        <MenuBookOutlined sx={{ color: "text.secondary" }} fontSize="small" />
      </IconButton>
    </Link>
  </Tooltip>
);

export default DocumentationIconLink;
