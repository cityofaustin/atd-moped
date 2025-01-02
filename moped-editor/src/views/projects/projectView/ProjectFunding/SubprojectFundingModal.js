import React, { useCallback, useMemo, useState } from "react";
import {
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import { DataGridPro } from "@mui/x-data-grid-pro";
import CloseIcon from "@mui/icons-material/Close";
import AddCircle from "@mui/icons-material/AddCircle";
import { useSocrataJson } from "src/utils/socrataHelpers";
import dataGridProStyleOverrides from "src/styles/dataGridProStylesOverrides";

const PAGE_SIZE = 10;

const useColumns = () =>
  useMemo(() => {
    return [
      {
        headerName: "FDU",
        field: "fdu",
        display: "flex",
        flex: 1,
      },
      {
        headerName: "Unit name",
        field: "unit_long_name",
        display: "flex",
        flex: 2,
      },
    ];
  }, []);

const SubprojectFundingModal = ({
  isDialogOpen,
  handleDialogClose,
  eCaprisID,
  fdusArray,
  addProjectFunding,
  projectId,
  setSnackbarState,
  refetch,
}) => {
  const { data } = useSocrataJson(
    `https://data.austintexas.gov/resource/jega-nqf6.json?dept_unit_status=Active&sp_number_txt=${eCaprisID}&$limit=9999`
  );
  // Filter the list of fdus to remove one(s) already on funding sources table
  const filteredData = data.filter((fdu) => !fdusArray.includes(fdu.fdu));

  const [selectedFdus, setSelectedFdus] = useState([]);

  const dataGridColumns = useColumns();

  const handleAddFunding = useCallback(() => {
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
      .then(() => {
        refetch().then(() => handleDialogClose());
      })
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
  }, [
    addProjectFunding,
    handleDialogClose,
    projectId,
    refetch,
    selectedFdus,
    setSnackbarState,
  ]);

  const handleRowSelection = useCallback(
    (selectedRows) => {
      const selectedFduRecords = selectedRows.map((fdu) =>
        filteredData.find((record) => record.fdu === fdu)
      );
      setSelectedFdus(selectedFduRecords);
    },
    [filteredData]
  );

  return (
    <Dialog
      open={isDialogOpen}
      onClose={handleDialogClose}
      fullWidth
      maxWidth={"md"}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        variant="h4"
      >
        Subproject funding sources
        <IconButton onClick={() => handleDialogClose()} size="large">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DataGridPro
          sx={dataGridProStyleOverrides}
          autoHeight
          columns={dataGridColumns}
          disableColumnMenu
          rows={filteredData}
          getRowId={(row) => row.fdu}
          density="comfortable"
          getRowHeight={() => "auto"}
          initialState={{
            pagination: {
              paginationModel: { pageSize: PAGE_SIZE, page: 0 },
            },
          }}
          pagination
          pageSizeOptions={[PAGE_SIZE]}
          localeText={{ noRowsLabel: "No FDUs available" }}
          checkboxSelection
          onRowSelectionModelChange={handleRowSelection}
        />
        <Box my={3} sx={{ display: "flex", flexDirection: "row-reverse" }}>
          <Button
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
