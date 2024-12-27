import React, { useMemo, useState } from "react";
import {
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddCircle from "@mui/icons-material/AddCircle";
import { useSocrataJson } from "src/utils/socrataHelpers";
import MaterialTable from "@material-table/core";

import typography from "../../../../theme/typography";

// DataGrid
import {
  DataGridPro,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  useGridApiRef,
} from "@mui/x-data-grid-pro";

import dataGridProStyleOverrides from "src/styles/dataGridProStylesOverrides";

const columns = [
  {
    ...GRID_CHECKBOX_SELECTION_COL_DEF,
    width: 100,
  },
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

const useColumns = () =>
  useMemo(() => {
    return [
      {
        headerName: "FDU",
        field: "fdu",
        // renderCell: ({ row }) => row.moped_milestone?.milestone_name,
        editable: false,
        width: 250,
      },
      {
        headerName: "Unit name",
        field: "unit_long_name",
        width: 200,
        editable: false,
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

  // DataGrid
  const apiRef = useGridApiRef();
  const dataGridColumns = useColumns();

  // TODO: Previous component hide pagination if less than 11 rows
  // TODO: Add checkbox column to select rows
  // TODO: Disable button if no rows selected using DataGridPro
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
  };

  const handleRowSelection = (selectedRows) => {
    const selectedFduRecords = selectedRows.map((fdu) =>
      filteredData.find((record) => record.fdu === fdu)
    );
    setSelectedFdus(selectedFduRecords);
  };

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
        <DataGridPro
          sx={dataGridProStyleOverrides}
          apiRef={apiRef}
          ref={apiRef}
          autoHeight
          columns={dataGridColumns}
          rows={filteredData}
          getRowId={(row) => row.fdu}
          // disableRowSelectionOnClick
          toolbar
          density="comfortable"
          getRowHeight={() => "auto"}
          hideFooter
          localeText={{ noRowsLabel: "No FDUs available" }}
          checkboxSelection
          onRowSelectionModelChange={handleRowSelection}
          // initialState={{ pinnedColumns: { left: ["select"] } }}
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
