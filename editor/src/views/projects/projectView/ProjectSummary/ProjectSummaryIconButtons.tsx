import { IconButton, Icon } from "@mui/material";

interface ProjectSummaryIconButtonsProps {
  /** Function to handle save action */
  handleSave: () => void;
  /** Function to handle close action */
  handleClose: () => void;
  /** Condition to disable the save button */
  disabledCondition: boolean;
  /** Loading state to disable buttons */
  loading: boolean;
}

const iconButtonStyles = {
  width: 40,
  height: 40,
  flexShrink: 0,
  alignSelf: "center",
};

const ProjectSummaryIconButtons = ({
  handleSave,
  handleClose,
  disabledCondition,
  loading,
}: ProjectSummaryIconButtonsProps) => {
  return (
    <div style={{ display: "contents" }}>
      <IconButton
        disabled={disabledCondition || loading}
        onClick={handleSave}
        sx={iconButtonStyles}
        type="submit"
      >
        <Icon>check</Icon>
      </IconButton>
      <IconButton
        disabled={loading}
        onClick={handleClose}
        sx={iconButtonStyles}
      >
        <Icon>close</Icon>
      </IconButton>
    </div>
  );
};

export default ProjectSummaryIconButtons;
