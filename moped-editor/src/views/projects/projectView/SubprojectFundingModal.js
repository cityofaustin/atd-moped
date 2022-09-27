import React, { useState } from "react";
import {
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import AddCircle from "@material-ui/icons/AddCircle";
import { useSocrataJson } from "src/utils/socrataHelpers";
import MaterialTable from "@material-table/core";

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

const columns = [
  {
    field: "fdu",
    title: "FDU",
    cellStyle: { padding: "12px" },
  },
  {
    field: "unit_long_name",
    title: "Unit name",
    cellStyle: { padding: "12px" },
  },
];

const SubprojectFundingModal = ({
  isDialogOpen,
  handleDialogClose,
  eCaprisID,
  fdusArray,
  addProjectFunding,
  userId,
  projectId,
  setSnackbarState,
}) => {
  const classes = useStyles();
  const typographyStyle = {
    fontFamily: typography.fontFamily,
    fontSize: "14px",
  };

  const { data } = useSocrataJson(
    `https://data.austintexas.gov/resource/jega-nqf6.json?dept_unit_status=Active&sp_number_txt=${eCaprisID}&$limit=9999`
  );

  const [selectedFdus, setSelectedFdus] = useState([]);

  // Filter the list of fdus to remove one(s) already on funding sources table
  const filteredData = data.filter((fdu) => !fdusArray.includes(fdu.fdu));

  const handleAddFunding = () => {
    const newFunds = [];
    // format record to match generic records added
    selectedFdus.forEach((fdu) => {
      const fduRecord = {};
      fduRecord.dept_unit = {
        dept: fdu.dept,
        dept_id: fdu.dept_id,
        dept_unit_id: fdu.dept_unit_id,
        dept_unit_status: fdu.dept_unit_status,
        unit: fdu.unit,
        unit_long_name: fdu.unit_long_name,
        unit_short_name: fdu.unit_short_name,
      };
      fduRecord.fund = {
        fund_id: fdu.fund,
        fund_name: fdu.fundname.toUpperCase(),
      };
      fduRecord.project_id = projectId;
      fduRecord.added_by = userId;
      // funding status 2 is "Confirmed"
      fduRecord.funding_status_id = 2;
      newFunds.push(fduRecord);
    });

    // include records in mutation
    addProjectFunding({
      variables: {
        objects: newFunds,
      },
    })
      .then(() => handleDialogClose())
      .catch((error) => {
        setSnackbarState({
          open: true,
          message: (
            <span>
              There was a problem adding funding. Error message: {error.message}
            </span>
          ),
          severity: "error",
        });
      });
    setSelectedFdus([]);
  };

  return (
    <Dialog
      open={isDialogOpen}
      onClose={handleDialogClose}
      fullWidth
      maxWidth={"md"}
    >
      <DialogTitle disableTypography className={classes.dialogTitle}>
        <h3>Subproject funding sources</h3>
        <IconButton onClick={() => handleDialogClose()}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <MaterialTable
          columns={columns}
          data={filteredData}
          localization={{
            body: {
              emptyDataSourceMessage: (
                <Typography>No FDUs available</Typography>
              ),
            },
          }}
          options={{
            ...(filteredData.length < 11 && {
              paging: false,
            }),
            search: false,
            toolbar: false,
            tableLayout: "fixed",
            selection: true,
            rowStyle: typographyStyle,
            pageSize: 10,
            showSelectAllCheckbox: false,
          }}
          onSelectionChange={(rows) => setSelectedFdus(rows)}
        />
        <Box my={3} sx={{ display: "flex", flexDirection: "row-reverse" }}>
          <Button
            className={classes.fundingButton}
            variant="contained"
            color="primary"
            size="medium"
            startIcon={<AddCircle />}
            onClick={handleAddFunding}
            disabled={!selectedFdus.length}
          >
            Add Funding Source
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SubprojectFundingModal;
