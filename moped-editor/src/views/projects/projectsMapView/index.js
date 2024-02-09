import React from "react";
import makeStyles from "@mui/styles/makeStyles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Paper from "@mui/material/Paper";
import { ErrorBoundary } from "react-error-boundary";
import Page from "src/components/Page";
import ProjectsMap from "./ProjectsMap";
import FallbackComponent from "src/components/FallbackComponent";
import { drawerWidth } from "../projectView/ProjectComponents";

const useStyles = makeStyles((theme) => ({
  content: {
    position: "relative",
    minHeight: "100%",
    margin: theme.spacing(3),
  },
}));

const ProjectsMapView = () => {
  const classes = useStyles();

  return (
    <Page className={classes.root} title="Projects Map">
      <ErrorBoundary FallbackComponent={FallbackComponent}>
        <Box component="main" className={classes.content}>
          <Paper sx={{ height: "85vh", display: "flex" }}>
            <Drawer
              sx={{
                width: drawerWidth,
                height: "100%",
                flexGrow: 1,
                "& .MuiDrawer-paper": {
                  width: drawerWidth,
                  boxSizing: "border-box",
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
              variant="permanent"
              anchor="left"
            ></Drawer>
            <ProjectsMap />
          </Paper>
        </Box>
      </ErrorBoundary>
    </Page>
  );
};

export default ProjectsMapView;
