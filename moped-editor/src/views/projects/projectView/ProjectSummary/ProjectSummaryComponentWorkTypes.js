import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import ProjectSummaryLabel from "src/views/projects/projectView/ProjectSummary/ProjectSummaryLabel";
import { fieldBox, fieldGridItem, fieldLabel, fieldLabelTextNoHover } from "src/styles/reusableStyles";

/**
 * @param {Object} data - The query data
 * @return {JSX.Element}
 * @constructor
 */
const ProjectSummaryComponentWorkTypes = ({ data }) => {
  const componentWorkTypes =
    data?.moped_project[0]?.project_list_view?.component_work_type_names;
  /* component_work_type_names is a comma-separated list in the database view */
  const componentWorkTypesArray = componentWorkTypes?.split(", ") ?? [];

  return (
    <Grid item xs={12} sx={fieldGridItem}>
      <Typography sx={fieldLabel}>
        Component work types
      </Typography>
      <Box
        display="flex"
        justifyContent="flex-start"
        sx={fieldBox}
      >
        <ProjectSummaryLabel
          text={componentWorkTypesArray}
          sxProp={fieldLabelTextNoHover}
        />
      </Box>
    </Grid>
  );
};

export default ProjectSummaryComponentWorkTypes;
