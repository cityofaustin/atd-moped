import React, { useState, useEffect, useMemo } from "react";
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
} from "@mui/material";
import { Autocomplete } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddCircle from "@mui/icons-material/AddCircle";
import {
  returnAMDSignalInfrastructureMilestoneTemplate,
  returnAMDInspectionOnlyMilestoneTemplate,
  returnPDDMilestoneTemplate,
} from "../../../../utils/timelineTemplates";

import { ADD_PROJECT_MILESTONE } from "../../../../queries/project";
import { useMutation } from "@apollo/client";

const templateChoices = [
  "AMD Signal Infrastructure",
  "AMD Inspection-only",
  "Project Delivery",
];

/**
 * useMemo hook to choose milestone options
 * @return {Object[]}
 */
const useMilestoneOptions = (template, projectId) =>
  useMemo(() => {
    if (template === "AMD Signal Infrastructure") {
      return returnAMDSignalInfrastructureMilestoneTemplate(projectId);
    } else if (template === "AMD Inspection-only") {
      return returnAMDInspectionOnlyMilestoneTemplate(projectId);
    } else if (template === "Project Delivery") {
      return returnPDDMilestoneTemplate(projectId);
    } else {
      return [];
    }
  }, [template, projectId]);

/**
 * useMemo hook to filter out already selected milestones
 * @return {Object[]}
 */
const useMilestoneSelections = (milestonesList, selectedMilestones) =>
  useMemo(() => {
    const selectedMilestonesIds = selectedMilestones.map(
      (milestone) => milestone.milestone_id
    );
    return milestonesList.filter(
      (option) => !selectedMilestonesIds.includes(option.milestone_id)
    );
  }, [milestonesList, selectedMilestones]);

const MilestoneTemplateModal = ({
  isDialogOpen,
  handleDialogClose,
  projectId,
  milestoneNameLookup,
  selectedMilestones,
  refetch,
}) => {
  const [template, setTemplate] = useState(null);
  const [milestonesToAdd, setMilestonesToAdd] = useState([]);

  const [addProjectMilestone] = useMutation(ADD_PROJECT_MILESTONE);

  const milestonesList = useMilestoneOptions(template, projectId);

  const filteredMilestonesList = useMilestoneSelections(
    milestonesList,
    selectedMilestones
  );

  useEffect(() => {
    setMilestonesToAdd([...filteredMilestonesList]);
  }, [filteredMilestonesList]);

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
      maxWidth="md"
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        variant="h4"
      >
        Select milestone template
        <IconButton onClick={closeDialog} size="large">
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
          {filteredMilestonesList.map((milestone) => {
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
