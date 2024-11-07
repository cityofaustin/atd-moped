import { Box, Typography } from "@mui/material";
import ButtonDropdownMenu from "src/components/ButtonDropdownMenu";

/** Custom toolbar title that resembles material table titles  */
const ProjectMilestoneToolbar = ({ addAction, setIsDialogOpen }) => (
  <Box display="flex" justifyContent="space-between" sx={{ margin: "1em" }}>
      <Typography variant="h2" color="primary">
        Milestones
      </Typography>
    <div style={{ padding: "1rem" }}>
      <ButtonDropdownMenu
        addAction={addAction}
        openActionDialog={setIsDialogOpen}
        parentButtonText="Add milestone"
        firstOptionText="New milestone"
        secondOptionText="From template"
        secondOptionIcon
      />
    </div>
  </Box>
);

export default ProjectMilestoneToolbar;

