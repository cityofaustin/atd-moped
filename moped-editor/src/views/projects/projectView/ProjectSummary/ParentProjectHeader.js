import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Typography } from "@mui/material";

/**
 * Renders the "Parent project" section shown in the Subprojects table header.
 *
 * - When a parent exists, show a link to that project.
 * - When the current project has children, show "This is a parent project".
 * - Otherwise, show "None".
 */
const ParentProjectHeader = ({
  parentProjectId,
  parentProjectName,
  hasChildren,
}) => {
  return (
    <Box sx={{ px: 0, py: 1 }}>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.5 }}>
        Parent project
      </Typography>
      {parentProjectId ? (
        <RouterLink to={`/moped/projects/${parentProjectId}`}>
          <Typography variant="body1" color="primary">
            {parentProjectName}
          </Typography>
        </RouterLink>
      ) : hasChildren ? (
        <Typography variant="body1">This is a parent project</Typography>
      ) : (
        <Typography variant="body1">None</Typography>
      )}
    </Box>
  );
};

export default ParentProjectHeader;
