import AddCircleIcon from "@mui/icons-material/AddCircle";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ButtonDropdownMenu from "../../../../components/ButtonDropdownMenu";
import ProjectSummaryProjectECapris from "../ProjectSummary/ProjectSummaryProjectECapris";

const ProjectFundingToolbar = ({
  onClick,
  eCaprisID,
  projectId,
  data,
  refetch,
  snackbarHandle,
  setIsDialogOpen,
  classes,
}) => (
  <Box display="flex" justifyContent="space-between" sx={{ margin: "1em" }}>
    <div>
      <Typography variant="h2" color="primary" className={classes.toolbarTitle}>
        Funding sources
      </Typography>
      <ProjectSummaryProjectECapris
        projectId={projectId}
        data={data}
        refetch={refetch}
        snackbarHandle={snackbarHandle}
        classes={classes}
        noWrapper
      />
    </div>

    {!!eCaprisID ? (
      <ButtonDropdownMenu
        buttonWrapperStyle={classes.fundingButton}
        addAction={onClick}
        openActionDialog={setIsDialogOpen}
        parentButtonText="Add Funding Source"
        firstOptionText="New funding source"
        secondOptionText="From eCapris"
      />
    ) : (
      <Button
        className={classes.fundingButton}
        variant="contained"
        color="primary"
        startIcon={<AddCircleIcon />}
        onClick={onClick}
      >
        Add Funding Source
      </Button>
    )}
  </Box>
);

export default ProjectFundingToolbar;
