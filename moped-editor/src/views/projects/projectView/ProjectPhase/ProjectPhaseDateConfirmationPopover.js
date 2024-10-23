import { useState } from "react";
import { Popover, Typography } from "@mui/material";

/**
 * Shows a popover indicating if a date is "estimated"
 * @param {boolean} isEnabled - if the popover should be enabled/active
 * @param {string} dataType - the date type that we be included in popover text. expecting `start` or `end`
 */
const ProjectPhaseDateConfirmationPopover = ({ children, isEnabled, dateType }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  return (
    <div
      onMouseEnter={handlePopoverOpen}
      onMouseLeave={handlePopoverClose}
      aria-owns={open ? "mouse-over-popover" : undefined}
      aria-haspopup="true"
    >
      {children}
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: "none",
        }}
        open={!!isEnabled && !!open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography sx={{ p: 1 }}>{`Estimated ${dateType} date`}</Typography>
      </Popover>
    </div>
  );
};

export default ProjectPhaseDateConfirmationPopover;
