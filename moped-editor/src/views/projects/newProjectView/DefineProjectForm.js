import React from "react";
import { Grid, InputLabel, Switch, Box } from "@mui/material";
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
  return (
    <form style={{ padding: 25 }}>
      <Grid container spacing={3} style={{ margin: 20 }}>
        <Grid item xs={6}>
          {!fromSignalAsset && ( // if
            <ControlledTextInput
              autoFocus
              variant="standard"
              fullWidth
              id="project_name"
              label="Project name"
              name="projectName"
              placeholder="Enter project name"
              control={control}
              error={!!errors?.projectName}
              helperText={errors?.projectName?.message}
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
          <ControlledTextInput
            variant="standard"
            fullWidth
            autoFocus
            id="secondary_name"
            name="projectSecondaryName"
            placeholder="Secondary name"
            label="Secondary name"
            control={control}
            error={!!errors?.projectSecondaryName}
            helperText={errors?.projectSecondaryName?.message}
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
          <ControlledTextInput
            variant="standard"
            fullWidth
            multiline
            minRows={4}
            maxRows={10}
            id="description"
            name="description"
            size="small"
            control={control}
            error={!!errors?.description}
            helperText={errors?.description?.message}
          />
        </Grid>
      </Grid>
    </form>
  );
};

export default DefineProjectForm;
