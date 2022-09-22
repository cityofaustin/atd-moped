import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  List,
  ListItemText,
  ListItemIcon,
  ListItem,
  TextField,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import AddCircle from "@material-ui/icons/AddCircle";
import { returnSignalPHBMilestoneTemplate } from "../../../utils/timelineTemplates";

import { ADD_PROJECT_MILESTONE } from "../../../queries/project";
import { useMutation } from "@apollo/client";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    color: theme.palette.primary.main,
    fontFamily: theme.typography.fontFamily,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));

const templateChoices = ["AMD", "PDD"];

const MilestoneTemplateModal = ({
  isDialogOpen,
  handleDialogClose,
  projectId,
  milestoneNameLookup,
  selectedMilestones,
  refetch,
}) => {
  const classes = useStyles();

  const [template, setTemplate] = useState(null);
  const [milestonesList, setMilestonesList] = useState([]);
  const [milestonesToAdd, setMilestonesToAdd] = useState([]);

  const [addProjectMilestone] = useMutation(ADD_PROJECT_MILESTONE);

  useEffect(() => {
    let options = [];
    const selectedMilestonesIds = selectedMilestones.map(
      (milestone) => milestone.milestone_id
    );
    setMilestonesList([]);
    if (template === "AMD") {
      options = returnSignalPHBMilestoneTemplate(projectId);
    }
    // if (template === "PDD") {
    // options = return other template
    // }
    const filteredOptions = options.filter(
      (option) => !selectedMilestonesIds.includes(option.milestone_id)
    );
    setMilestonesList(filteredOptions);
    setMilestonesToAdd(filteredOptions);
  }, [template, selectedMilestones, projectId]);

  // checks if milestone is in list of milestones to add
  // if in list, remove. if not, add.
  const handleToggle = (milestone) => {
    const currentIndex = milestonesToAdd.indexOf(milestone);
    const newChecked = [...milestonesToAdd];

    if (currentIndex === -1) {
      newChecked.push(milestone);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setMilestonesToAdd(newChecked);
  };

  // calls function to close dialog and also resets state
  const closeDialog = () => {
    handleDialogClose();
    setMilestonesToAdd([]);
    setMilestonesList([]);
    setTemplate(null);
  };

  const handleAddMilestones = () => {
    addProjectMilestone({
      variables: {
        objects: milestonesToAdd,
      },
    }).then(() => refetch());
    closeDialog();
  };

  return (
    <Dialog
      open={isDialogOpen}
      onClose={handleDialogClose}
      fullWidth
      maxWidth={"md"}
    >
      <DialogTitle disableTypography className={classes.dialogTitle}>
        <h3>Select milestone template</h3>
        <IconButton onClick={closeDialog}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box my={3} sx={{ display: "flex", justifyContent: "space-between" }}>
          <Autocomplete
            style={{ width: "250px" }}
            defaultValue={null}
            id="specify-milestone-template-autocomplete"
            options={templateChoices}
            onChange={(event, newValue) => {
              setTemplate(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label={"Timeline template"}
              />
            )}
          />
          <Button
            className={classes.fundingButton}
            variant="contained"
            color="primary"
            size="medium"
            startIcon={<AddCircle />}
            onClick={handleAddMilestones}
            disabled={milestonesToAdd.length === 0}
          >
            Add milestones
          </Button>
        </Box>
        <List dense>
          {milestonesList.map((milestone) => {
            return (
              <ListItem
                button
                key={milestone.milestone_id}
                dense
                onClick={() => handleToggle(milestone)}
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={milestonesToAdd.indexOf(milestone) > -1}
                    tabIndex={-1}
                    disableRipple
                    color={"primary"}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={milestoneNameLookup[milestone.milestone_id]}
                />
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default MilestoneTemplateModal;
