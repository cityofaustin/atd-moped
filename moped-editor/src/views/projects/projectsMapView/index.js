import React from "react";
import FallbackComponent from "src/components/FallbackComponent";
import MapDrawer from "./components/MapDrawer";
import Page from "src/components/Page";
import ProjectsMap from "./ProjectsMap";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";
import { ErrorBoundary } from "react-error-boundary";

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
          <Paper sx={{ height: "80vh", display: "flex" }}>
            <MapDrawer ref={mapRef}>
              <Stack spacing={1}>
                <Typography>Filter UI placeholder</Typography>
                <Typography>Filter UI placeholder</Typography>
              </Stack>
            </MapDrawer>
            <Box
              sx={{
                flexGrow: 1,
                /* Give the map the same border-radius as MUI Paper and hide map overflow */
                borderTopRightRadius: "4px",
                borderBottomRightRadius: "4px",
                overflow: "hidden",
              }}
            >
              <ProjectsMap ref={mapRef} />
            </Box>
          </Paper>
        </Box>
      </ErrorBoundary>
    </Page>
  );
};

export default ProjectsMapView;
