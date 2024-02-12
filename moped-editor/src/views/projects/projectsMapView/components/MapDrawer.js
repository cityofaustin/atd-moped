import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MuiDrawer from "@mui/material/Drawer";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { styled, useTheme } from "@mui/material/styles";
import { drawerWidth } from "../../projectView/ProjectComponents";

/* Inspired by the MUI Drawer mini variant. See https://mui.com/material-ui/react-drawer/#mini-variant-drawer */
const openedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  width: drawerWidth,
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: theme.spacing(7),
});

/* Contain drawer within Paper wrapper (instead of full screen drawer) */
const containDrawerMixin = () => ({
  "& .MuiDrawer-root": {
    position: "relative",
  },
  "& .MuiPaper-root": {
    position: "relative",
    borderTopLeftRadius: "4px",
    borderBottomLeftRadius: "4px",
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  ...containDrawerMixin(),
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...containDrawerMixin(),
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MapDrawer({ children }) {
  const theme = useTheme();

  /* Control drawer and content visibility */
  const [open, setOpen] = React.useState(true);
  const [showDrawerContent, setShowDrawerContent] = React.useState(true);

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [showMobileDrawerContent, setShowMobileDrawerContent] =
    React.useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleTransitionEnd = () => {
    if (open) {
      setShowDrawerContent(true);
    } else {
      setShowDrawerContent(false);
    }
  };

  const toggleMobileDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMobileTransitionEnd = () => {
    if (open) {
      setShowMobileDrawerContent(true);
    } else {
      setShowMobileDrawerContent(false);
    }
  };

  /* Resize map canvas on drawer toggle */

  return (
    <>
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        open={open}
        onTransitionEnd={handleTransitionEnd}
        sx={{ display: { xs: "none", sm: "flex" } }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "nowrap",
            padding: theme.spacing(1),
            height: "100%",
          }}
        >
          <Box sx={{ flexGrow: 1, display: open ? "flex" : "none" }}>
            {showDrawerContent ? children : null}
          </Box>
          <Box>
            <IconButton onClick={toggleDrawer}>
              {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </Box>
        </Box>
      </Drawer>
      {/* Mobile drawer */}
      <Drawer
        variant="permanent"
        open={mobileOpen}
        onTransitionEnd={handleMobileTransitionEnd}
        sx={{ display: { xs: "flex", sm: "none" } }}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "nowrap",
            padding: theme.spacing(1),
            height: "100%",
          }}
        >
          <Box sx={{ flexGrow: 1, display: mobileOpen ? "flex" : "none" }}>
            {showMobileDrawerContent ? children : null}
          </Box>
          <Box>
            <IconButton onClick={toggleMobileDrawer}>
              {mobileOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
