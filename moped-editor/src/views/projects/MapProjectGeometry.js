import React from "react";
import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

const MapProjectGeometry = () => {
  let options = ["option 1", "option 2", "option 3"];

  return (
    <Box className={classes.mapBox}>
      <ProjectMap />
    </Box>
  );
};

export default MapProjectGeometry;
