import React, { useState } from "react";
import {
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import AddCircle from "@material-ui/icons/AddCircle";
import MaterialTable from "@material-table/core";
import { returnSignalPHBMilestoneTemplate } from "../../../utils/timelineTemplates";


import typography from "../../../theme/typography";

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
  selectedMilestones
}) => {
  const classes = useStyles();
  const typographyStyle = {
    fontFamily: typography.fontFamily,
    fontSize: "14px",
  };

  const [template, setTemplate] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const data = [];


  // when you pick a template
  // load the milestones and put in state
  // show on a table. 
  // make it so you can toggle them off


  const handleAddMilestones = () => {
    console.log("add the thing")
    // run the update
  };

  const selectedMilestonesIds = selectedMilestones.map(milestone => milestone.milestone_id)

  const selectMilestones = () => {
    setMilestones([]);
    let choices = [];
    if (template === "AMD") {
      choices = returnSignalPHBMilestoneTemplate(projectId)
      choices.forEach(choice=>console.log(!selectedMilestonesIds.includes(choice.milestone_id)))
      setMilestones(choices.filter(choice => !selectedMilestonesIds.includes(choice.milestone_id)))
    }
  }

console.log(milestones)
const columns = [
  {
    field: "milestone_id",
    title: "Milestone name",
    cellStyle: { padding: "12px" },
    render: (entry) => ( milestoneNameLookup[entry.milestone_id]
      ),
  }
];

  return (
    <Dialog
      open={isDialogOpen}
      onClose={handleDialogClose}
      fullWidth
      maxWidth={"md"}
    >
      <DialogTitle disableTypography className={classes.dialogTitle}>
        <h3>Select milestone template</h3>
        <IconButton onClick={() => handleDialogClose()}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box my={3} sx={{display: "flex", justifyContent: "space-between" }}>
                  <Autocomplete
            // value={
            //   templateTypesList.filter(type => type.type_id === projectTypeId)
            //     .type_name
            // }
            style={{width: "250px"}}
            defaultValue={null}
            id="specify-milestone-template-autocomplete"
            options={templateChoices}
            // getOptionLabel={t => t.type_name}
            onChange={(event, newValue) => {
              console.log(newValue)
              setTemplate(newValue);
              selectMilestones(newValue);
            }}
            renderInput={params => (
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
            disabled={!template}
          >
            Add milestones
          </Button>
        </Box>
        {milestones.length > 0 &&
        <MaterialTable
          columns={columns}
          data={milestones}
          options={{
            paging: false,
            search: false,
            toolbar: false,
            tableLayout: "fixed",
            selection: true,
            rowStyle: typographyStyle,
            pageSize: 10,
            showSelectAllCheckbox: false,
            selectionProps: rowData => {
              console.log(rowData.milestone_id)
              return {color: "primary", checked: true}}
          }}
          onSelectionChange={(rows) => console.log(rows)}
        />}
      </DialogContent>
    </Dialog>
  );
};

export default MilestoneTemplateModal;
