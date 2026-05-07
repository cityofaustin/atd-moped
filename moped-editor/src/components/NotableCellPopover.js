import { useState } from "react";
import { Popover, Typography } from "@mui/material";

/**
 * Displays a data-grid cell value with an optional notable marker and popover.
 */
const NotableCellPopover = ({ value, isEnabled, popoverText }) => {
  const [anchorElement, setAnchorElement] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorElement(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorElement(null);
  };

  const open = Boolean(anchorElement);

  return (
    <div
      onMouseEnter={handlePopoverOpen}
      onMouseLeave={handlePopoverClose}
      aria-controls={open ? "mouse-over-popover" : undefined}
      aria-haspopup="true"
    >
      <span>{isEnabled ? `${value}*` : value}</span>
      <Popover
        id="mouse-over-popover"
        sx={{ pointerEvents: "none" }}
        open={!!isEnabled && !!open}
        anchorEl={anchorElement}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography sx={{ p: 1 }}>{popoverText}</Typography>
      </Popover>
    </div>
  );
};

export default NotableCellPopover;
