import { Box, Typography } from "@mui/material";
import ButtonDropdownMenu from "src/components/ButtonDropdownMenu";
import { Button } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';

/** Custom toolbar title that resembles material table titles  */
const ProjectTeamToolbar = ({ addAction, setIsDialogOpen }) => (
  <Box display="flex" justifyContent="space-between" sx={{ margin: "1em" }}>
      <Typography variant="h2" color="primary">
        Project Team
      </Typography>
    <div style={{ padding: "1rem" }}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddCircleIcon />}
        onClick={addAction}
      >
        Add team member
      </Button>
    </div>
  </Box>
);

export default ProjectTeamToolbar;