import { Box, Typography } from "@mui/material";
import ProjectSubstantialCompletionDate from "src/views/projects/projectView/ProjectPhase/ProjectSubstantialCompletionDate";
import theme from "src/theme";

// TODO: Props
// title
// primary button and action
// secondary button and action
// children for second row or more complex content (eCAPRIS sync switch, eCAPRIS subproject id forms, etc.)
/** Custom toolbar title that resembles material table titles  */
const DataGridToolbar = ({ title, PrimaryActionButton, completionDate }) => (
  <Box display="flex" justifyContent="space-between" sx={{ margin: "1em" }}>
    <div>
      <Typography
        variant="h2"
        color="primary"
        sx={{ marginBottom: theme.spacing(1) }}
      >
        {title}
      </Typography>
      <ProjectSubstantialCompletionDate completionDate={completionDate} />
    </div>
    <div>{PrimaryActionButton}</div>
  </Box>
);

export default DataGridToolbar;
