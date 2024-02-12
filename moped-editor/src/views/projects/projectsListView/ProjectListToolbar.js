import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  // GridToolbarFilterButton,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";

const ProjectListToolbar = () => (
  //todo maybe: sx={{justifyContent:"end"}}, but then we need to also override the popper
  <GridToolbarContainer>
    <GridToolbarColumnsButton />
    <GridToolbarDensitySelector />
    {/* <GridToolbarFilterButton /> */}
  </GridToolbarContainer>
);

export default ProjectListToolbar;
