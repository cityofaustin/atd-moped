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
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import AddCircle from "@material-ui/icons/AddCircle";
import { returnArterialManagementPhaseTemplate } from "../../../utils/timelineTemplates";

import { ADD_PROJECT_PHASE } from "../../../queries/project";
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

const templateChoices = ["Arterial Management"];

/**
 * useMemo hook to choose phase options
 * @return {Object[]}
 */
const usePhaseOptions = (template, projectId) =>
  useMemo(() => {
    if (template === "Arterial Management") {
      return returnArterialManagementPhaseTemplate(projectId);
    } else {
      return [];
    }
  }, [template, projectId]);

/**
 * useMemo hook to filter out already selected phases
 * @return {Object[]}
 */
const usePhaseSelections = (phasesList, selectedPhases) =>
  useMemo(() => {
    const selectedPhaseSubphaseCombinations = selectedPhases.map(
      (phase) =>
        String(phase.moped_phase.phase_id) +
        String(phase.subphase_id) +
        String(phase.phase_description)
    );

    return phasesList.filter(
      (option) =>
        !selectedPhaseSubphaseCombinations.includes(
          String(option.phase_id) +
            String(option.subphase_id) +
            String(option.phase_description ?? null) // phase_description here could come back as undefined,
          // it needs to be null for it to match the comobinations above
        )
    );
  }, [phasesList, selectedPhases]);

const PhaseTemplateModal = ({
  isDialogOpen,
  handleDialogClose,
  projectId,
  selectedPhases,
  refetch,
  phaseNameLookup,
  subphaseNameLookup,
}) => {
  const classes = useStyles();

  const [template, setTemplate] = useState(null);
  const [phasesToAdd, setPhasesToAdd] = useState([]);

  const [addProjectPhase] = useMutation(ADD_PROJECT_PHASE);

  const phasesList = usePhaseOptions(template, projectId);

  const filteredPhasesList = usePhaseSelections(phasesList, selectedPhases);

  useEffect(() => {
    setPhasesToAdd([...filteredPhasesList]);
  }, [filteredPhasesList]);

  // checks if phase is in list of phases to add
  // if in list, remove. if not, add.
  const handleToggle = (phase) => {
    const currentIndex = phasesToAdd.indexOf(phase);
    const newChecked = [...phasesToAdd];

    if (currentIndex === -1) {
      newChecked.push(phase);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setPhasesToAdd(newChecked);
  };

  // calls function to close dialog and also resets state
  const closeDialog = () => {
    handleDialogClose();
    setPhasesToAdd([]);
    setTemplate(null);
  };

  const handleAddPhases = () => {
    addProjectPhase({
      variables: {
        objects: phasesToAdd,
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
        <h3>Select phase template</h3>
        <IconButton onClick={closeDialog}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box my={3} sx={{ display: "flex", justifyContent: "space-between" }}>
          <Autocomplete
            style={{ width: "250px" }}
            defaultValue={null}
            id="specify-phase-template-autocomplete"
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
            onClick={handleAddPhases}
            disabled={phasesToAdd.length === 0}
          >
            Add phases
          </Button>
        </Box>
        <List dense>
          {filteredPhasesList.map((phase) => {
            let secondaryText = subphaseNameLookup[phase.subphase_id] ?? "";
            if (phase.phase_description) {
              if (secondaryText) {
                secondaryText = secondaryText + " - " + phase.phase_description;
              } else {
                secondaryText = phase.phase_description;
              }
            }
            return (
              <ListItem
                button
                key={`${phase.phase_id}${phase.subphase_id}${phase.phase_description}`}
                dense
                onClick={() => handleToggle(phase)}
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={phasesToAdd.indexOf(phase) > -1}
                    tabIndex={-1}
                    disableRipple
                    color={"primary"}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={phaseNameLookup[phase.phase_id]}
                  secondary={secondaryText}
                />
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default PhaseTemplateModal;
