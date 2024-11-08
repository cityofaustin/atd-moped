import React from "react";
import { useGridApiContext } from "@mui/x-data-grid-pro";
import { FormControl, FormHelperText, TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

const SubprojectLookupComponent = ({ id, value, field, hasFocus, data }) => {
  const apiRef = useGridApiContext();
  const ref = React.useRef(null);

  console.log(hasFocus, ref, ref.current, "Test");

  // React.useEffect(() => {
  //   if (hasFocus) {
  //     ref.current.focus();
  //     console.log("we are focusing");
  //   }
  // }, [hasFocus]);

  const handleChange = (event, newValue) => {
    apiRef.current.setEditCellValue({
      id,
      field,
      value: newValue ? newValue : null,
    });
  };

  return (
    <FormControl variant="standard" style={{ width: "100%" }}>
      <Autocomplete
        id="project_name"
        name="project_name"
        options={data?.subprojectOptions}
        getOptionLabel={(option) =>
          `${option.project_id} - ${option.project_name_full}`
        }
        value={value || null}
        onChange={handleChange}
        renderInput={(params) => <TextField variant="standard" {...params} />}
      />
      <FormHelperText>Required</FormHelperText>
    </FormControl>
  );
};

export default SubprojectLookupComponent;
