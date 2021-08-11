import React from "react";
import { TextField, Grid, InputLabel, Switch } from "@material-ui/core";

const DefineProjectForm = ({
  projectDetails,
  setProjectDetails,
  nameError,
  descriptionError,
}) => {
  const handleFieldChange = (value, name) => {
    const updatedProjectDetails = { ...projectDetails, [name]: value };

    setProjectDetails(updatedProjectDetails);
  };

  return (
    <form style={{ padding: 25 }}>
      <Grid container spacing={3} style={{ margin: 20 }}>
        <Grid item xs={6}>
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
          <TextField
            name="start_date"
            label="Start date"
            type="date"
            variant="standard"
            value={projectDetails.start_date}
            onChange={e => handleFieldChange(e.target.value, e.target.name)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} style={{ margin: 20 }}>
        <Grid item xs={3}>
          <InputLabel>Capital funding?</InputLabel>
          <Switch
            type="checkbox"
            checked={projectDetails.capitally_funded}
            color="primary"
            name="capitally_funded"
            inputProps={{ "aria-label": "primary checkbox" }}
            onChange={e => handleFieldChange(e.target.checked, e.target.name)}
          />
        </Grid>
        {projectDetails.capitally_funded && (
          <Grid item xs={3}>
            <TextField
              label="eCAPRIS subproject ID"
              name="ecapris_subproject_id"
              variant="standard"
              type="text"
              value={projectDetails.ecapris_subproject_id}
              onChange={e => handleFieldChange(e.target.value, e.target.name)}
            />
          </Grid>
        )}
      </Grid>
    </form>
  );
};

export default DefineProjectForm;
