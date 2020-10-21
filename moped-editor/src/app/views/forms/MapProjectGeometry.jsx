import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
// import { gql, useMutation, useQuery } from "@apollo/client";


const MapProjectGeometry= ({ formContent }) => {
  const methods = useFormContext();
  const { reset } = methods;
  useEffect(() => {
    reset({ ...formContent.three }, { errors: true });
  }, []);

  let options = ["option 1", "option 2", "option 3"];

  return (
    <div> 
      <form>
      <Autocomplete
          id="selectedOptions"
          options={options}
          style={{ width: 150 }}
          renderInput={(params) => <TextField {...params} label="Options" 
          margin="normal" />} 
        />
      </form>
    </div>
  );
}
  
export default MapProjectGeometry;