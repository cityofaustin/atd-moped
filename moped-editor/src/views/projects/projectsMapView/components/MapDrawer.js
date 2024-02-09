import React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import Fab from "@mui/material/Fab";
import MenuIcon from "@mui/icons-material/Menu";
import theme from "src/theme";
import { drawerWidth } from "../../projectView/ProjectComponents";

const DRAWER_WIDTH_MOBILE = 240;

export default function MapDrawer({ children }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  return (
    <>
      <CssBaseline />
      <Fab
        color="primary"
        aria-label="toggle filters"
        size="small"
        sx={{
          display: { xs: "flex", sm: "none" },
          position: "absolute",
          top: theme.spacing(2),
          left: theme.spacing(2),
        }}
        onClick={handleDrawerToggle}
      >
        <MenuIcon />
      </Fab>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="projects map filters"
      >
        {/* Mobile collapsible drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH_MOBILE,
            },
            /* Position drawer absolutely within the Paper wrapper */
            "& .MuiDrawer-root": {
              position: "absolute",
            },
            "& .MuiPaper-root": {
              position: "absolute",
              borderRadius: "4px",
            },
          }}
        >
          {children}
        </Drawer>
        {/* Desktop permanent drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
            /* Position drawer absolutely within the Paper wrapper */
            "& .MuiDrawer-root": {
              position: "absolute",
            },
            "& .MuiPaper-root": {
              position: "absolute",
              borderRadius: "4px",
            },
          }}
          open
        >
          {children}
        </Drawer>
      </Box>
    </>
  );
}
