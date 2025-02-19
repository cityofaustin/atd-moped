import React from "react";
import { TextField, Grid, InputLabel, Switch, Box } from "@mui/material";
import SignalAutocomplete from "src/views/projects/newProjectView/SignalAutocomplete";

const DefineProjectForm = ({
  projectDetails,
  setProjectDetails,
  nameError,
  descriptionError,
  setSignalRecord,
  fromSignalAsset,
  setFromSignalAsset,
  signal,
  setSignal,
  signalError,
}) => {
  const handleFieldChange = (value, name) => {
    const updatedProjectDetails = { ...projectDetails, [name]: value };

    setProjectDetails(updatedProjectDetails);
  };

  return (
    <form style={{ padding: 25 }}>
      <Grid container spacing={3} style={{ margin: 20 }}>
        <Grid item xs={6}>
          {!fromSignalAsset && ( // if
            <TextField
              sx={{ marginBottom: "2rem" }}
              variant="standard"
              required
              autoFocus
              label="Project name"
              name="project_name"
              type="text"
              fullWidth
              value={projectDetails.project_name}
              error={nameError}
              helperText="Required"
              InputLabelProps={{ required: false }}
              onChange={(e) => handleFieldChange(e.target.value, e.target.name)}
            />
          )}
          {fromSignalAsset && ( // else
            <Box sx={{ marginBottom: "2.1rem" }}>
              <SignalAutocomplete
                signal={signal}
                setSignal={setSignal}
                projectDetails={projectDetails}
                setProjectDetails={setProjectDetails}
                setSignalRecord={setSignalRecord}
                signalError={signalError}
              />
            </Box>
          )}

          <TextField
            sx={{ marginBottom: ".5rem" }}
            variant="standard"
            label="Secondary name"
            name="project_name_secondary"
            type="text"
            fullWidth
            value={projectDetails.project_name_secondary || ""}
            onChange={(e) => handleFieldChange(e.target.value, e.target.name)}
          />
        </Grid>
        <Grid item xs={3}>
          <InputLabel>Use signal asset</InputLabel>
          <Switch
            variant="standard"
            type="checkbox"
            checked={fromSignalAsset}
            color="primary"
            name="use_signal_id"
            inputProps={{ "aria-label": "primary checkbox" }}
            onChange={(e) => setFromSignalAsset(e.target.checked)}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3} style={{ margin: 20 }}>
        <Grid item xs={6}>
          <TextField
            variant="standard"
            required
            label="Description"
            name="project_description"
            multiline={true}
            type="text"
            fullWidth
            value={projectDetails.project_description}
            error={descriptionError !== null}
            helperText={descriptionError?.message}
            InputLabelProps={{ required: false }}
            onChange={(e) => handleFieldChange(e.target.value, e.target.name)}
          />
        </Grid>
      </Grid>
    </form>
  );
};

export default DefineProjectForm;
