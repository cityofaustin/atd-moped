import ProjectNameEditable from "./ProjectNameEditable";
import ProjectSecondaryNameEditable from "./ProjectSecondaryNameEditable";
import makeStyles from "@mui/styles/makeStyles";
import {
  Grid,
  Icon,
  Box,
  Typography,
  TextField,
} from "@mui/material";
import ProjectStatusBadge from "./ProjectStatusBadge";

const useStyles = makeStyles((theme) => ({
  editIcons: {
    cursor: "pointer",
    marginTop: "16px",
    fontSize: "2rem",
  },
}));


const ProjectNameComplex = (props) => {
  const classes = useStyles();
  // here are the props, i miss typescript
  // projectData={data.moped_project[0]}
  // projectId={projectId}
  // editable={true}
  // isEditing={isEditing}
  // setIsEditing={setIsEditing}
  // updatedCallback={handleNameUpdate}

  if (!props.isEditing) {
    return (
      <>
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
            <Box sx={{ display: "inline", paddingLeft: "10px" }}>
              <Typography
                color="textSecondary"
                variant="h2"
                sx={{ display: "inline" }}
              >
                #{props.projectId}
              </Typography>
            </Box>
            <Box sx={{ display: "inline", position: "relative", top: "-5px" }}>
              <ProjectStatusBadge
                phaseKey={props.currentPhase?.phase_key}
                phaseName={props.currentPhase?.phase_name}
              />
            </Box>
          </Grid>
          {props.projectData.project_name_secondary && props.projectData.project_name_secondary.length > 0 ? (
            <Grid item xs={12}>
              <Box sx={{ display: "inline" }}>
                <Typography
                  color="textSecondary"
                  variant="h2"
                  sx={{ display: "inline", fontSize: "1.2rem"}}
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
        <Grid container>
          <Grid item xs={12} sm={5} sx={{ paddingRight: "30px" }}>
            <TextField
              variant="standard"
              fullWidth
              id="project_name"
              label={"Project Name"}
              type="text"
              // defaultValue={projectName ?? props?.projectName}
              // error={titleError}
              // placeholder={
              //   titleError ? "Title cannot be blank" : "Enter project name"
              // }
              multiline={false}
              rows={1}
              // onChange={(e) => handleProjectNameChange(e)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} sx={{ paddingRight: "30px" }}>
            <TextField
              variant="standard"
              fullWidth
              id="secondary_name"
              label={"Secondary Name"}
              type="text"
              // defaultValue={projectName ?? props?.projectName}
              // error={titleError}
              // placeholder={
              //   titleError ? "Title cannot be blank" : "Enter project name"
              // }
              multiline={false}
              rows={1}
              // onChange={(e) => handleProjectNameChange(e)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={1} sx={{ minWidth: "65px" }}>
            <Icon
              className={classes.editIcons}
              // onClick={handleAcceptClick}
            >
              check
            </Icon>
            <Icon
              className={classes.editIcons}
              // onClick={(e) => handleCancelClick(e)}
            >
              close
            </Icon>
          </Grid>
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
