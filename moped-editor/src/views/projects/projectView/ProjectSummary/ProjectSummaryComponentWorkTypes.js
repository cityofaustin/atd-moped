import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import ProjectSummaryLabel from "src/views/projects/projectView/ProjectSummary/ProjectSummaryLabel";

/**
 * @param {Object} data - The query data
 * @param {Object} classes - The shared style settings
 * @return {JSX.Element}
 * @constructor
 */
const ProjectSummaryComponentWorkTypes = ({ classes, data }) => {
  return (
    <Grid item xs={12} className={classes.fieldGridItem}>
      <Typography className={classes.fieldLabel}>
        Component work types
      </Typography>
      <Box
        display="flex"
        justifyContent="flex-start"
        className={classes.fieldBox}
      >
        <ProjectSummaryLabel
          text={data?.project_list_view?.[0]?.component_work_type_names.split(
            ", "
          )}
          className={classes.fieldLabelTextNoHover}
        />
      </Box>
    </Grid>
  );
};

export default ProjectSummaryComponentWorkTypes;
