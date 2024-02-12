import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Grid from "@mui/material/Grid";
import { drawerWidth } from "../../projectView/ProjectComponents";
import { set } from "date-fns";

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

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
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

export default function MapDrawer({ children }) {
  const theme = useTheme();

  /* Control drawer and content display */
  const [open, setOpen] = React.useState(true);
  const [showDrawerContent, setShowDrawerContent] = React.useState(false);

  const toggleDrawer = () => {
    if (open) {
      setShowDrawerContent(false);
    }
    setOpen(!open);
  };

  const handleTransitionEnd = () => {
    if (open) {
      setShowDrawerContent(true);
    }
  };

  return (
    <>
      <Drawer
        variant="permanent"
        onTransitionEnd={handleTransitionEnd}
        open={open}
        ModalProps={{
          container: document.getElementById("map-wrapper"),
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
          {showDrawerContent ? (
            <Grid item flexGrow={1}>
              {children}
            </Grid>
          ) : null}
          <Grid item>
            <IconButton onClick={toggleDrawer}>
              {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </Grid>
        </Grid>
      </Drawer>
    </>
  );
}
