import { Link as RouterLink } from "react-router-dom";
import { Tooltip } from "@mui/material";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import MenuBookOutlined from "@mui/icons-material/MenuBookOutlined";

/**
 * Documentation icon link component for pointing to documentation or data dictionary
 *
 * @param {string} tooltipText - Tooltip text displayed on hover
 * @param {string} documentationLink - Link to documentation
 */
const DocumentationIconLink = ({
  tooltipText = "View documentation",
  documentationLink,
}) => (
  <Tooltip title={tooltipText}>
    <Button sx={{ ml: 1, minWidth: 3 }} color="inherit" size="small">
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
    </Button>
  </Tooltip>
);

export default DocumentationIconLink;
