import { Box, Typography } from "@mui/material";
import { Button } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';

const ProjectTeamToolbar = ({ addAction }) => (
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