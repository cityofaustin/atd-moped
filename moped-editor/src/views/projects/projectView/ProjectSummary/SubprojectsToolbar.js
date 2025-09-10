import AddCircleIcon from "@mui/icons-material/AddCircle";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
/** Custom toolbar title that resembles the material table titles we used  */
const SubprojectsToolbar = ({ onClick }) => (
  <Box display="flex" justifyContent="space-between" sx={{ margin: "1em" }}>
    <Typography variant="h2" color="primary">
      Subprojects
    </Typography>
    <Button
      variant="outlined"
      color="primary"
      startIcon={<AddCircleIcon />}
      onClick={onClick}
    >
      Add Subproject
    </Button>
  </Box>
);

export default SubprojectsToolbar;
