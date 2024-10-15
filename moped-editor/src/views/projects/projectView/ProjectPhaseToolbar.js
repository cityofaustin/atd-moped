import { Box, Typography } from "@mui/material";
import ButtonDropdownMenu from "src/components/ButtonDropdownMenu";
import ProjectSubstantialCompletionDate from "./ProjectSubstantialCompletionDate";

/** Custom toolbar title that resembles material table titles  */
const ProjectPhaseToolbar = ({ addAction, setIsDialogOpen }) => (
  <Box display="flex" justifyContent="space-between" sx={{ margin: "1em" }}>
    <div>
      <Typography variant="h2" color="primary" style={{ paddingTop: "1em" }}>
        Phases
      </Typography>
      <ProjectSubstantialCompletionDate text="test" />
    </div>
    <div style={{ padding: "1rem" }}>
      <ButtonDropdownMenu
        addAction={addAction}
        openActionDialog={setIsDialogOpen}
        parentButtonText="Add phase"
        firstOptionText="New phase"
        secondOptionText="From template"
        secondOptionIcon
      />
    </div>
  </Box>
);

export default ProjectPhaseToolbar;
