import React from "react";
import makeStyles from "@mui/styles/makeStyles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { ErrorBoundary } from "react-error-boundary";
import Page from "src/components/Page";
import ProjectsMap from "./ProjectsMap";
import FallbackComponent from "src/components/FallbackComponent";
import MapDrawer from "./components/MapDrawer";
import { Typography } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  content: {
    position: "relative",
    minHeight: "100%",
    margin: theme.spacing(3),
  },
}));

const ProjectsMapView = () => {
  const mapRef = React.useRef();
  const classes = useStyles();

  return (
    <Page className={classes.root} title="Projects Map">
      <ErrorBoundary FallbackComponent={FallbackComponent}>
        <Box component="main" className={classes.content}>
          <Paper id="map-wrapper" sx={{ height: "80vh", display: "flex" }}>
            <MapDrawer ref={mapRef}>
              <Stack spacing={1}>
                <Typography>Filter UI placeholder</Typography>
                <Typography>Filter UI placeholder</Typography>
              </Stack>
            </MapDrawer>
            <ProjectsMap ref={mapRef} />
          </Paper>
        </Box>
      </ErrorBoundary>
    </Page>
  );
};

export default ProjectsMapView;
