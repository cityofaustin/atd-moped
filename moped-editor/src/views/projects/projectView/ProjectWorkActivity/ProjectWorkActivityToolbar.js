import AddCircleIcon from "@mui/icons-material/AddCircle";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

/** Custom toolbar title that resmbles the material table titles we use  */
const WorkActivityToolbar = ({ onClick }) => (
  <Box display="flex" justifyContent="space-between">
    <Typography variant="h2" color="primary" style={{ padding: "1em" }}>
      Work activities
    </Typography>
    <div style={{ padding: "1rem" }}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddCircleIcon />}
        onClick={onClick}
      >
        Add Work Activity
      </Button>
    </div>
  </Box>
);

export default WorkActivityToolbar;
