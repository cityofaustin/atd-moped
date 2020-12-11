import React from "react";
import ProjectMap from "./ProjectMap";
import { Box, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  mapBox: {
    padding: 25,
  },
}));

const MapProjectGeometry = () => {
  const classes = useStyles();

  return (
    <Box className={classes.mapBox}>
      <ProjectMap />
    </Box>
  );
};

export default MapProjectGeometry;
