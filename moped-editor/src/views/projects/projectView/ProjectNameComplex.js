import ProjectNameEditable from "./ProjectNameEditable";
import ProjectSecondaryNameEditable from "./ProjectSecondaryNameEditable";
import makeStyles from "@mui/styles/makeStyles";
import {
  Grid,
  Icon,
  Typography,
  TextField,
} from "@mui/material";

const useStyles = makeStyles((theme) => ({}));


const ProjectNameComplex = (props) => {
  const classes = useStyles();
  // here are the props, i miss typescript
  // projectData={data.moped_project[0]}
  // projectId={projectId}
  // editable={true}
  // isEditing={isEditing}
  // setIsEditing={setIsEditing}
  // updatedCallback={handleNameUpdate}

  return (
    <>
      <ProjectNameEditable
        projectName={props.projectData.project_name}
        projectId={props.projectId}
        editable={true}
        isEditing={props.isEditing}
        setIsEditing={props.setIsEditing}
        updatedCallback={props.handleNameUpdate}
      />
      <ProjectSecondaryNameEditable
        projectName={props.projectData.project_name_secondary}
        projectId={props.projectId}
        editable={true}
        isEditing={props.isEditing}
        setIsEditing={props.setIsEditing}
        updatedCallback={props.handleNameUpdate}
      />
      {
        // if not Editing Project Name, clicking on project title allows one to edit
        !props.isEditing && (
          <Typography
            color="textSecondary"
            variant="h2"
            className={classes.titleId}
          >
            &nbsp;#{props.projectId}
          </Typography>
        )
      }
      {props.isEditing && (
        <form onSubmit={(e) => props.handleAcceptClick(e)}>
          <Grid container>
            <Grid item xs={12} sm={1} className={classes.fieldGridItemButtons}>
              <Icon
                className={classes.editIconConfirm}
                onClick={props.handleAcceptClick}
              >
                check
              </Icon>
              <Icon
                className={classes.editIconConfirm}
                onClick={(e) => props.handleCancelClick(e)}
              >
                close
              </Icon>
            </Grid>
          </Grid>
        </form>
      )}
    </>
  );
};

export default ProjectNameComplex;
