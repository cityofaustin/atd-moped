import React from "react";
import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

const MapProjectGeometry = () => {
  let options = ["option 1", "option 2", "option 3"];

  return (
    <form>
      <Autocomplete
        id="selectedOptions"
        options={options}
        style={{ width: 150 }}
        renderInput={params => (
          <TextField {...params} label="Options" margin="normal" />
        )}
      />
    </form>
  );
};

export default MapProjectGeometry;
