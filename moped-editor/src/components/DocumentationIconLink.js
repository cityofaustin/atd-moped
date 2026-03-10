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
 */
const DocumentationIconLink = ({
  tooltipText = "View documentation",
  documentationLink,
  size = "small",
}) => (
  <Tooltip title={tooltipText}>
    <IconButton sx={{ ml: 1, minWidth: 3 }} color="inherit" size={size}>
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
        <MenuBookOutlined sx={{ color: "text.secondary" }} fontSize="small" />
      </Link>
    </IconButton>
  </Tooltip>
);

export default DocumentationIconLink;
