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
}) => {
  const classes = useStyles();

  const [template, setTemplate] = useState(null);
  const [milestonesList, setMilestonesList] = useState([]);
  const [milestonesToAdd, setMilestonesToAdd] = useState([]);
  // when you pick a template
  // load the milestones and put in state
  // show on a table.
  // make it so you can toggle them off

  const handleAddMilestones = () => {
    console.log("add the thing");
    // run the update
  };

  useEffect(() => {
    console.log("template changed");
    let choices = [];
    const selectedMilestonesIds = selectedMilestones.map(
      (milestone) => milestone.milestone_id
    );
    setMilestonesList([]);
    if (template === "AMD") {
      choices = returnSignalPHBMilestoneTemplate(projectId);
      const filteredChoices = choices.filter(
        (choice) => !selectedMilestonesIds.includes(choice.milestone_id)
      );
      setMilestonesList(filteredChoices);
      setMilestonesToAdd(filteredChoices);
    }
  }, [template, selectedMilestones, projectId]);

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

  const closeDialog = () => {
    handleDialogClose();
    setMilestonesToAdd([]);
    setMilestonesList([]);
    setTemplate(null);
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
            // getOptionLabel={t => t.type_name}
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
                role={undefined}
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
                    // inputProps={{ 'aria-labelledby': labelId }}
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
