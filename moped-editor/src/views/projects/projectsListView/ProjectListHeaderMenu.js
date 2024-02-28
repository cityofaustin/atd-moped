import {
  GridColumnMenu
} from "@mui/x-data-grid";

const ProjectListHeaderMenu = (props) => (
    <GridColumnMenu
      {...props}
      slots={{
        columnMenuColumnsItem: null
      }}
    />
);

export default ProjectListHeaderMenu;
