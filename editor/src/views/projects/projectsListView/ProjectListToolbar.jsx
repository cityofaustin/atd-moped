import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
} from "@mui/x-data-grid-pro";

const ProjectListToolbar = () => (
  <GridToolbarContainer sx={{ paddingLeft: "4px" }}>
    <GridToolbarColumnsButton />
  </GridToolbarContainer>
);

export default ProjectListToolbar;
