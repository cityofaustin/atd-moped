import React from "react";
import { TextField, Grid, InputLabel, Switch } from "@mui/material";
import { Autocomplete } from '@mui/material';
import SignalAutocomplete from "./SignalAutocomplete";

const DefineProjectForm = ({
  projectDetails,
  setProjectDetails,
  nameError,
  descriptionError,
  setFeatureCollection,
  fromSignalAsset,
  setFromSignalAsset,
  signal,
  setSignal,
  signalError,
  projectTypeId,
  setProjectTypeId,
  typeData,
}) => {
  const handleFieldChange = (value, name) => {
    const updatedProjectDetails = { ...projectDetails, [name]: value };

    setProjectDetails(updatedProjectDetails);
  };

  const typesList = typeData?.moped_types ?? [];
  // We only have templates for types: Signal - New, Signal - Mod, PHB - New, PHB - Mod
  // Filter out other types based on type_id
  const templateTypesList = typesList.filter(object =>
    [1, 2, 4, 5].includes(object.type_id)
  );

  return (
    <form style={{ padding: 25 }}>
      <Grid container spacing={3} style={{ margin: 20 }}>
        <Grid item xs={6}>
          {!fromSignalAsset && (
            <TextField
              required
              label="Project name"
              name="project_name"
              variant="standard"
              type="text"
              fullWidth
              value={projectDetails.project_name}
              error={nameError}
              helperText="Required"
              InputLabelProps={{ required: false }}
              onChange={e => handleFieldChange(e.target.value, e.target.name)}
            />
          )}
          {fromSignalAsset && (
            <SignalAutocomplete
              signal={signal}
              setSignal={setSignal}
              projectDetails={projectDetails}
              setProjectDetails={setProjectDetails}
              setFeatureCollection={setFeatureCollection}
              signalError={signalError}
            />
          )}
        </Grid>
        <Grid item xs={3}>
          <InputLabel>Use signal asset</InputLabel>
          <Switch
            type="checkbox"
            checked={fromSignalAsset}
            color="primary"
            name="use_signal_id"
            inputProps={{ "aria-label": "primary checkbox" }}
            onChange={e => setFromSignalAsset(e.target.checked)}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} style={{ margin: 20 }}>
        <Grid item xs={6}>
          <TextField
            required
            label="Description"
            name="project_description"
            multiline={true}
            variant="standard"
            type="text"
            fullWidth
            value={projectDetails.project_description}
            error={descriptionError}
            helperText="Required"
            InputLabelProps={{ required: false }}
            onChange={e => handleFieldChange(e.target.value, e.target.name)}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} style={{ margin: 20 }}>
        <Grid item xs={3}>
          <Autocomplete
            value={
              templateTypesList.filter(type => type.type_id === projectTypeId)
                .type_name
            }
            defaultValue={null}
            id="specify-milestone-template-autocomplete"
            options={templateTypesList}
            getOptionLabel={t => t.type_name}
            onChange={(event, newValue) => {
              setProjectTypeId(newValue.type_id);
            }}
            renderInput={params => (
              <TextField
                {...params}
                variant="standard"
                label={"Timeline template"}
              />
            )}
          />
        </Grid>
      </Grid>
    </form>
  );
};

export default DefineProjectForm;
