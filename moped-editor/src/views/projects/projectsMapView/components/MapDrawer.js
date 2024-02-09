// import React from "react";
// import Box from "@mui/material/Box";
// import CssBaseline from "@mui/material/CssBaseline";
// import Drawer from "@mui/material/Drawer";
// import Fab from "@mui/material/Fab";
// import Grid from "@mui/material/Grid";
// import MenuIcon from "@mui/icons-material/Menu";
// import theme from "src/theme";
// import { drawerWidth } from "../../projectView/ProjectComponents";
// import { IconButton } from "@mui/material";
// import { ChevronRight } from "@mui/icons-material";
// import { ChevronLeft } from "@mui/icons-material";

// const DRAWER_WIDTH_MOBILE = 240;

// export default React.forwardRef(function MapDrawer({ children }, ref) {
//   const [mobileOpen, setMobileOpen] = React.useState(false);
//   const [isClosing, setIsClosing] = React.useState(false);

//   const [desktopOpen, setDesktopOpen] = React.useState(true);
//   const [isDesktopClosing, setIsDesktopClosing] = React.useState(false);

//   const handleDrawerClose = () => {
//     setIsClosing(true);
//     setMobileOpen(false);
//   };

//   const handleDrawerTransitionEnd = () => {
//     setIsClosing(false);
//   };

//   const handleDrawerToggle = () => {
//     if (!isClosing) {
//       setMobileOpen(!mobileOpen);
//     }
//   };

//   const handleDesktopDrawerClose = () => {
//     setIsDesktopClosing(true);
//     setDesktopOpen(false);
//   };

//   const handleDesktopDrawerTransitionEnd = () => {
//     setIsDesktopClosing(false);
//   };

//   const handleDesktopDrawerToggle = () => {
//     if (!isDesktopClosing) {
//       setDesktopOpen(!isDesktopClosing);
//     }
//   };

//   return (
//     <>
//       <CssBaseline />
//       <Fab
//         color="primary"
//         aria-label="toggle filters"
//         size="small"
//         sx={{
//           display: { xs: "flex", sm: "none" },
//           position: "absolute",
//           top: theme.spacing(2),
//           left: theme.spacing(2),
//         }}
//         onClick={handleDrawerToggle}
//       >
//         <MenuIcon />
//       </Fab>
//       <Box
//         component="nav"
//         sx={{
//           display: "relative",
//           width: { sm: drawerWidth },
//           flexShrink: { sm: 0 },
//         }}
//         aria-label="projects map filters"
//       >
//         {/* Mobile collapsible drawer */}
//         <Drawer
//           variant="temporary"
//           open={mobileOpen}
//           onTransitionEnd={handleDrawerTransitionEnd}
//           onClose={handleDrawerClose}
//           ModalProps={{
//             keepMounted: true, // Better open performance on mobile.
//           }}
//           sx={{
//             display: { xs: "block", sm: "none" },
//             "& .MuiDrawer-paper": {
//               boxSizing: "border-box",
//               width: DRAWER_WIDTH_MOBILE,
//             },
//             /* Position drawer absolutely within the Paper wrapper */
//             "& .MuiDrawer-root": {
//               position: "absolute",
//             },
//             "& .MuiPaper-root": {
//               position: "absolute",
//             },
//           }}
//         >
//           {children}
//         </Drawer>
//         {/* Desktop permanent drawer */}
//         <Drawer
//           variant="temporary"
//           open={desktopOpen}
//           onTransitionEnd={handleDesktopDrawerTransitionEnd}
//           onClose={handleDesktopDrawerClose}
//           sx={{
//             display: { xs: "none", sm: "block" },
//             "& .MuiDrawer-paper": {
//               boxSizing: "border-box",
//               width: drawerWidth,
//             },
//             /* Position drawer absolutely within the Paper wrapper */
//             "& .MuiDrawer-root": {
//               position: "relative",
//             },
//             "& .MuiPaper-root": {
//               position: "relative",
//               borderTopLeftRadius: "4px",
//               borderBottomLeftRadius: "4px",
//             },
//           }}
//           // PaperProps={{ style: { position: "absolute" } }}
//           ModalProps={{
//             container: () => ref.current,
//             style: { position: "absolute" },
//             keepMounted: true, // <=============== THIS
//           }}
//         >
//           <Grid container sx={{ padding: theme.spacing(1) }}>
//             <Grid sx={{ flexGrow: 1 }}>{children}</Grid>
//             <Grid>
//               <IconButton
//                 aria-label="toggle filters"
//                 size="small"
//                 onClick={handleDesktopDrawerToggle}
//               >
//                 <ChevronLeft />
//               </IconButton>
//             </Grid>
//           </Grid>
//         </Drawer>
//       </Box>
//     </>
//   );
// });

import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Grid from "@mui/material/Grid";
import { drawerWidth } from "../../projectView/ProjectComponents";

const openedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  // right: drawerWidth,
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: 0,
  // width: `calc(${theme.spacing(7)} + 1px)`,
  // [theme.breakpoints.up("sm")]: {
  //   width: `calc(${theme.spacing(7)} + 1px)`,
  // },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  // right: drawerWidth,
  // right: 0,
  // flexShrink: 0,
  // whiteSpace: "nowrap",
  // boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
    "& .MuiDrawer-root": {
      position: "relative",
    },
    "& .MuiPaper-root": {
      position: "relative",
      borderTopLeftRadius: "4px",
      borderBottomLeftRadius: "4px",
    },
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
    "& .MuiDrawer-root": {
      position: "relative",
    },
    "& .MuiPaper-root": {
      position: "relative",
      borderTopLeftRadius: "4px",
      borderBottomLeftRadius: "4px",
    },
  }),
}));

export default function MiniDrawer({ children }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <>
      {!open ? (
        <Grid
          container
          sx={{
            padding: theme.spacing(1),
            position: "relative",
            width: theme.spacing(7),
          }}
        >
          <Grid item xs={1}>
            <IconButton onClick={handleDrawerOpen}>
              <ChevronRightIcon />
            </IconButton>
          </Grid>
        </Grid>
      ) : null}

      <Drawer
        variant="permanent"
        open={open}
        ModalProps={{
          container: document.getElementById("map-wrapper"),
          keepMounted: true,
          /* Position drawer within the Paper wrapper */
          "& .MuiDrawer-root": {
            position: "relative",
          },
          "& .MuiPaper-root": {
            position: "relative",
            borderTopLeftRadius: "4px",
            borderBottomLeftRadius: "4px",
          },
        }}
      >
        <Grid container padding={theme.spacing(1)}>
          <Grid item flexGrow={1}>
            {children}
          </Grid>

          <Grid item>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Drawer>
    </>
  );
}
