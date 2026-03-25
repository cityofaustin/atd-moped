import * as React from "react";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import MuiDrawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { styled } from "@mui/material/styles";
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
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  ...containDrawerMixin(),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...containDrawerMixin(),
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

function DrawerContent({
  children,
  toggleDrawer,
  open,
  title,
  showDrawerContent,
}) {
  return (
    <>
      <Grid2
        container
        sx={(theme) => ({
          position: "relative",
          padding: theme.spacing(1),
        })}
      >
        <Grid2 container alignItems="center">
          <Grid2
            flexGrow={1}
            display={showDrawerContent && open ? "flex" : "none"}
          >
            <Typography
              variant="h2"
              color={(theme) => theme.palette.text.primary}
              paddingLeft={(theme) => theme.spacing(1)}
            >
              {title}
            </Typography>
          </Grid2>
          <Grid2>
            <IconButton
              onClick={toggleDrawer}
              sx={(theme) => ({
                position: "absolute",
                right: theme.spacing(0.5),
                top: theme.spacing(0.5),
                zIndex: 2,
              })}
            >
              {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </Grid2>
        </Grid2>
      </Grid2>
      <Box
        flexGrow={1}
        display={showDrawerContent && open ? "flex" : "none"}
        overflow="scroll"
        padding={(theme) => theme.spacing(1)}
        paddingLeft={(theme) => theme.spacing(2)}
      >
        {children}
      </Box>
    </>
  );
}

/**
 * Collapsible drawer for map filters.
 * See https://mui.com/material-ui/react-drawer/#responsive-drawer
 * See https://mui.com/material-ui/react-drawer/#mini-variant-drawer
 */
export default React.forwardRef(function MapDrawer(
  { children, title, open, setOpen },
  ref
) {
  /* Control desktop drawer and content visibility */
  const [showDrawerContent, setShowDrawerContent] = React.useState(true);

  const toggleDrawer = () => {
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
        <DrawerContent
          title={title}
          open={open}
          toggleDrawer={toggleDrawer}
          showDrawerContent={showDrawerContent}
        >
          {children}
        </DrawerContent>
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
        <DrawerContent
          title={title}
          open={mobileOpen}
          toggleDrawer={toggleMobileDrawer}
          showDrawerContent={showMobileDrawerContent}
        >
          {children}
        </DrawerContent>
      </Drawer>
    </>
  );
});
