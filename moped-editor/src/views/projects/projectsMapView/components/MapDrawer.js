import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MuiDrawer from "@mui/material/Drawer";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { styled, useTheme } from "@mui/material/styles";
import { drawerWidth } from "../../projectView/ProjectComponents";

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

/**
 * Collapsible drawer for map filters.
 * See https://mui.com/material-ui/react-drawer/#responsive-drawer
 * See https://mui.com/material-ui/react-drawer/#mini-variant-drawer
 */
export default React.forwardRef(function MapDrawer({ children }, ref) {
  const theme = useTheme();

  /* Control desktop drawer and content visibility */
  const [open, setOpen] = React.useState(true);
  const [showDrawerContent, setShowDrawerContent] = React.useState(true);

  const toggleDrawer = () => {
    ref.current && ref.current.resize();
    setOpen(!open);
  };

  const handleTransitionEnd = () => {
    if (open) {
      setShowDrawerContent(true);
    } else {
      // Repaint canvas on drawer close to avoid blank space in map
      ref.current && ref.current.resize();
      setShowDrawerContent(false);
    }
  };

  /* Control mobile drawer and content visibility */
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [showMobileDrawerContent, setShowMobileDrawerContent] =
    React.useState(false);

  const toggleMobileDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMobileTransitionEnd = () => {
    if (mobileOpen) {
      setShowMobileDrawerContent(true);
    } else {
      setShowMobileDrawerContent(false);
    }
  };

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
          <Box
            sx={{
              flexGrow: 1,
              display: showDrawerContent && open ? "flex" : "none",
            }}
          >
            {children}
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
          <Box
            sx={{
              flexGrow: 1,
              display: mobileOpen && showMobileDrawerContent ? "flex" : "none",
            }}
          >
            {children}
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
});
