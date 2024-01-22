import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { Outlet, Navigate } from "react-router-dom";
import makeStyles from "@mui/styles/makeStyles";
import {
  Box,
  Toolbar,
  Drawer as MuiDrawer,
  Divider,
  IconButton,
} from "@mui/material";
import TopBar from "./TopBar";
import { useUser } from "../../auth/user";
import Footer from "./Footer";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  // root: {
  //   display: "flex",
  //   height: "vh100",
  //   overflow: "hidden",
  //   width: "100%",
  //   backgroundColor: "black",
  // },
  wrapper: {
    display: "flex",
    flex: "1 1 auto",
    overflow: "hidden",
    backgroundColor: "orange",
    // If in staging environment, add extra padding
    // to make room for staging environment info alert
    // paddingTop: process.env.REACT_APP_HASURA_ENV !== "production" ? 114 : 64,
    // paddingTop: 64,
  },
  contentContainer: {
    display: "flex",
    flex: "1 1 auto",
    overflow: "hidden",
    backgroundColor: "green",
  },
  content: {
    flex: "1 1 auto",
    height: "100%",
    overflow: "auto",
  },
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const DashboardLayout = () => {
  const [open, setOpen] = useState(true);
  const classes = useStyles();
  const { user } = useUser();

  // console.debug("user", user);

  return user ? (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "white",
        overflow: "hidden",
        height: "100vh",
        // paddingTop: "64px",
      }}
    >
      {/* <TopBar /> */}
      <Drawer variant="permanent" open={open}>
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: [1],
          }}
        >
          <IconButton onClick={() => setOpen(!open)}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <div>hello</div>
      </Drawer>
      <Box
        component="main"
        sx={{
          // backgroundColor: "orange",
          flexGrow: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          // marginTop: "63px",
        }}
      >
        <Outlet />
        {/* <Footer /> */}
      </Box>
    </Box>
  ) : (
    <Navigate to="/moped/session/signin" />
  );
};

export default DashboardLayout;
