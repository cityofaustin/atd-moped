import React from "react";
import { Grid, Icon, Box, TextField } from "@mui/material";
import ProjectStatusBadge from "./ProjectStatusBadge";

const ProjectNameForm = ({
  projectName,
  primaryTitleError,
  handleProjectNameChange,
  secondaryName,
  handleSecondaryNameChange,
  handleAcceptClick,
  handleCancelClick,
  classes,
  props,
}) => (
  <Grid container>
    {/* Primary project name field */}
    <Grid item xs={12} sm={6} sx={{ paddingRight: "30px" }}>
      <form onSubmit={(e) => handleAcceptClick(e)}>
        <TextField
          required
          autoFocus
          variant="standard"
          fullWidth
          id="project_name"
          label={"Project Name"}
          type="text"
          value={projectName}
          error={primaryTitleError}
          placeholder={
            primaryTitleError ? "Title cannot be blank" : "Enter project name"
          }
          multiline={false}
          rows={1}
          onChange={handleProjectNameChange}
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            classes: {
              input: classes.projectNameEditField,
            },
          }}
        />
      </form>
    </Grid>

    {/* Secondary project name field */}
    <Grid item xs={12} sm={3} sx={{ paddingRight: "25px" }}>
      <form onSubmit={(e) => handleAcceptClick(e)}>
        <TextField
          variant="standard"
          fullWidth
          id="secondary_name"
          label={"Secondary Name"}
          type="text"
          value={secondaryName}
          placeholder={"Secondary Name"}
          multiline={false}
          rows={1}
          onChange={handleSecondaryNameChange}
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            classes: {
              input: classes.projectSecondaryNameEditField,
            },
          }}
        />
      </form>
    </Grid>

    {/* Accept / Cancel icons.
      This grid item gets a minimum width to prevent it from reflowing onto two lines. */}
    <Grid item xs={12} sm={1} sx={{ minWidth: "65px" }}>
      <Icon className={classes.editIcons} onClick={(e) => handleAcceptClick(e)}>
        check
      </Icon>
      <Icon className={classes.editIcons} onClick={(e) => handleCancelClick(e)}>
        close
      </Icon>
    </Grid>

    {/* The status badge. Here, we're going to jog it down a bit to make it visually centered
      along the horizontal midline of the project name input field. */}
    <Grid item xs={12} md={2}>
      <Box sx={{ display: "inline", position: "relative", top: "1rem" }}>
        <ProjectStatusBadge
          phaseKey={props.currentPhase?.phase_key}
          phaseName={props.currentPhase?.phase_name}
        />
      </Box>
    </Grid>
  </Grid>
);

export default ProjectNameForm;
