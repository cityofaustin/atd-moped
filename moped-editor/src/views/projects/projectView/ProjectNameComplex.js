import React, { useState } from "react";
import makeStyles from "@mui/styles/makeStyles";
import { Grid, Icon, Box, Typography, TextField } from "@mui/material";
import ProjectStatusBadge from "./ProjectStatusBadge";

const useStyles = makeStyles((theme) => ({
  editIcons: {
    cursor: "pointer",
    marginTop: "16px",
    fontSize: "2rem",
  },
  projectNameEditField: {
    "font-size": "1.5rem",
    "font-weight": "bold",
  },
  projectSecondaryNameEditField: {
    "font-size": "1.0rem",
    "font-weight": "bold",
    "padding-top": "0.95rem",
  },
}));

const ProjectNameComplex = (props) => {
  // here are the props, i miss typescript
  // projectData={data.moped_project[0]} ✅
  // projectId={projectId} ✅
  // editable={true} ❓
  // isEditing={isEditing} ✅
  // setIsEditing={setIsEditing} ✅
  // updatedCallback={handleNameUpdate} ✅

  const [primaryTitleError, setPrimaryTitleError] = useState(false);

  const classes = useStyles();


  const handleAcceptClick = (e) => {
    e.preventDefault();

    const projectName = document.getElementById("project_name").value;
    const secondaryName = document.getElementById("secondary_name").value;

    if (!projectName) {
      setPrimaryTitleError(true);
    } else {
      setPrimaryTitleError(false);
      props.updatedCallback();
    }
  };

  const handleCancelClick = (e) => {
    e.preventDefault();
    props.setIsEditing(false);
  };

  const handleProjectNameChange = (e) => {
    const projectName = document.getElementById("project_name").value;
    if (!projectName) {
      setPrimaryTitleError(true);
    } else { 
      setPrimaryTitleError(false);
    }
  }

  if (!props.isEditing) {
    return (
      <>
        {/* This grid contains two 12-column wide grid items, forcing the secondary name to flow to the next line.
        Block elements must be avoided, as they prevent the project number and status badge from floating to the
        immediate right of the project name and number.  */}
        <Grid container>
          <Grid item xs={12}>
            <Box sx={{ display: "inline", cursor: "pointer" }}>
              <Typography
                color="textPrimary"
                variant="h2"
                sx={{ display: "inline" }}
                onClick={() => props.setIsEditing(true)}
              >
                {props.projectData.project_name}
              </Typography>
            </Box>

            {/* Padding, not margin, must be used, or else you'll run into trouble with the 12 column 
            system always reflowing to the next line. */}
            <Box sx={{ display: "inline", paddingLeft: "10px" }}>
              <Typography
                color="textSecondary"
                variant="h2"
                sx={{ display: "inline" }}
              >
                #{props.projectId}
              </Typography>
            </Box>

            {/* Jogging this up 5 a bit to make it visually centered along the horizontal midline of the project name. */}
            <Box sx={{ display: "inline", position: "relative", top: "-5px" }}>
              <ProjectStatusBadge
                phaseKey={props.currentPhase?.phase_key}
                phaseName={props.currentPhase?.phase_name}
              />
            </Box>
          </Grid>

          {/* The secondary name field is shown conditionally, only if it is defined and not the empty string.
          This prevents it from taking up height if it's not displaying anything. */}
          {props.projectData.project_name_secondary &&
          props.projectData.project_name_secondary.length > 0 ? (
            <Grid item xs={12}>
              <Box sx={{ display: "inline", cursor: "pointer" }}>
                <Typography
                  color="textSecondary"
                  variant="h2"
                  sx={{ display: "inline", fontSize: "1.2rem" }}
                  onClick={() => props.setIsEditing(true)}
                >
                  {props.projectData.project_name_secondary}
                </Typography>
              </Box>
            </Grid>
          ) : null}
        </Grid>
      </>
    );
  } else {
    return (
      <>
        {/* This grid contains the project name and secondary name fields, the accept/cancel icons and the badge.
        Multiple widths are set for each element so that they reflow responsively as the viewport becomes more narrow. */}
        <Grid container>

          {/* Primary project name field */}
          <Grid item xs={12} sm={6} sx={{ paddingRight: "30px" }}>
            <TextField
              variant="standard"
              fullWidth
              id="project_name"
              label={"Project Name"}
              type="text"
              defaultValue={props.projectData.project_name}
              error={primaryTitleError}
              placeholder={
                primaryTitleError ? "Title cannot be blank" : "Enter project name"
              }
              multiline={false}
              rows={1}
              onChange={(e) => handleProjectNameChange(e)}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                classes: {
                  input: classes.projectNameEditField,
                },
              }}
            />
          </Grid>

          {/* Secondary project name field */}
          <Grid item xs={12} sm={3} sx={{ paddingRight: "30px" }}>
            <TextField
              variant="standard"
              fullWidth
              id="secondary_name"
              label={"Secondary Name"}
              type="text"
              defaultValue={props.projectData.project_name_secondary}
              // error={secondaryTitleError}
              placeholder={ "Project Byline" }
              multiline={false}
              rows={1}
              onChange={(e) => handleProjectNameChange(e)}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                classes: {
                  input: classes.projectSecondaryNameEditField,
                },
              }}
            />
          </Grid>

          {/* Accept / Cancel icons.
          This grid item gets a minimum width to prevent it from reflowing onto two lines. */}
          <Grid item xs={12} sm={1} sx={{ minWidth: "65px" }}>
            <Icon
              className={classes.editIcons}
              onClick={(e) => handleAcceptClick(e)}
            >
              check
            </Icon>
            <Icon
              className={classes.editIcons}
              onClick={(e) => handleCancelClick(e)}
            >
              close
            </Icon>
          </Grid>

          {/* The status badge. Here, we're going to jog it down a bit to make it visually centered
          along the horizontal midline of the project name input field. */}
          <Grid item xs={12} md={2}>
            <Box sx={{ display: "inline", position: "relative", top: "5px" }}>
              <ProjectStatusBadge
                phaseKey={props.currentPhase?.phase_key}
                phaseName={props.currentPhase?.phase_name}
              />
            </Box>
          </Grid>

        </Grid>
      </>
    );
  }
};

export default ProjectNameComplex;
