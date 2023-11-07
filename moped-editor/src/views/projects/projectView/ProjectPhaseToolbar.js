import AddCircleIcon from "@mui/icons-material/AddCircle";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ButtonDropdownMenu from "src/components/ButtonDropdownMenu";

/** Custom toolbar title that resembles the material table titles we use  */
const ProjectPhaseToolbar = ({ addAction, setIsDialogOpen }) => (
  <Box display="flex" justifyContent="space-between">
    <Typography variant="h2" color="primary" style={{ padding: "1em" }}>
      Phases
    </Typography>
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
