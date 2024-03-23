import ProjectNameEditable from "./ProjectNameEditable";
import ProjectSecondaryNameEditable from "./ProjectSecondaryNameEditable";
import makeStyles from "@mui/styles/makeStyles";
import {
  Grid,
  Icon,
  Typography,
  TextField,
} from "@mui/material";

const useStyles = makeStyles((theme) => ({
  editIconConfirm: {
    cursor: "pointer",
    marginTop: "16px",
    fontSize: "2rem",
  },
  fieldGridItemButtons: {
    width: "70px",
  }
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

  if (props.isEditing) {
    return (
      <Grid container>
        <Grid item xs={7}>
          <ProjectNameEditable
            projectName={props.projectData.project_name}
            projectId={props.projectId}
            editable={true}
            isEditing={props.isEditing}
            setIsEditing={props.setIsEditing}
            updatedCallback={props.handleNameUpdate}
          />
        </Grid>
        <Grid item xs="4">
          <ProjectSecondaryNameEditable
            projectSecondaryName={props.projectData.project_name_secondary}
            projectId={props.projectId}
            editable={true}
            isEditing={props.isEditing}
            setIsEditing={props.setIsEditing}
            updatedCallback={props.handleNameUpdate}
          />
        </Grid>
        <form onSubmit={(e) => props.handleAcceptClick(e)}>
          <Grid item>
            <Grid container>
              <Grid item xs={12} sm={12} className={classes.fieldGridItemButtons}>
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
          </Grid>
        </form>
      </Grid>
    );
  } else {
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
          <Typography
            color="textSecondary"
            variant="h2"
            className={classes.titleId}
          >
            &nbsp;#{props.projectId}
          </Typography>
    </>
    );
  }
};

export default ProjectNameComplex;
