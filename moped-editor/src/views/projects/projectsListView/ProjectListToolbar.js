import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
} from "@mui/x-data-grid-pro";

const ProjectListToolbar = () => (
  <GridToolbarContainer sx={{ justifyContent: "flex-start" }}>
    <GridToolbarColumnsButton />
  </GridToolbarContainer>
);

export default ProjectListToolbar;
