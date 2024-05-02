import AddCircleIcon from "@mui/icons-material/AddCircle";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarFilterButton,
} from "@mui/x-data-grid-pro";
/** Custom toolbar title that resembles the material table titles we use  */
const WorkActivityToolbar = ({ onClick }) => (
  <>
    <Box display="flex" justifyContent="space-between" sx={{ margin: "1em" }}>
      <Typography variant="h2" color="primary">
        Work activities
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddCircleIcon />}
        onClick={onClick}
      >
        Add Work Activity
      </Button>
    </Box>
    <GridToolbarContainer sx={{ marginLeft: "1em" }}>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  </>
);

export default WorkActivityToolbar;
