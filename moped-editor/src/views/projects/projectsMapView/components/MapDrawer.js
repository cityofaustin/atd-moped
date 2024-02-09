// import React from "react";
// import Drawer from "@mui/material/Drawer";
// import { drawerWidth } from "../../projectView/ProjectComponents";

// const MapDrawer = ({ children }) => {
//   return (
//     <Drawer
//       sx={{
//         width: drawerWidth,
//         height: "100%",
//         flexGrow: 1,
//         "& .MuiDrawer-paper": {
//           width: drawerWidth,
//           boxSizing: "border-box",
//         },
//         /* Position drawer absolutely within the Paper wrapper */
//         "& .MuiDrawer-root": {
//           position: "absolute",
//         },
//         "& .MuiPaper-root": {
//           position: "absolute",
//           borderRadius: "4px",
//         },
//       }}
//       variant="temporary"
//       anchor="left"
//     >
//       {children}
//     </Drawer>
//   );
// };

// export default MapDrawer;

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import theme from "src/theme";

const drawerWidth = 240;

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
      <IconButton
        sx={{
          display: { xs: "block", sm: "none" },
          position: "relative",
          top: theme.spacing(1),
          left: theme.spacing(1),
        }}
        onClick={handleDrawerToggle}
        aria-label="open filters"
      >
        <MenuIcon />
      </IconButton>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="projects map filters"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}

        <Drawer
          // container={container}
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
        >
          {children}
        </Drawer>
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
