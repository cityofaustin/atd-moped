import React, { useCallback, useMemo, useState, useEffect } from "react";
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
import { useQuery } from "@apollo/client";
import dataGridProStyleOverrides from "src/styles/dataGridProStylesOverrides";
import { ECAPRIS_SUBPROJECT_FDU_QUERY } from "src/queries/funding";
import { currencyFormatter } from "src/utils/numberFormatters";

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
      {
        headerName: "Status",
        field: "fdu_status",
        display: "flex",
        flex: 1,
      },
      {
        headerName: "Amount",
        field: "amount",
        display: "flex",
        flex: 1,
        valueFormatter: (value) => currencyFormatter.format(value),
        type: "currency",
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
  handleSnackbar,
  refetch,
}) => {
  console.log(eCaprisID);

  const { data } = useQuery(ECAPRIS_SUBPROJECT_FDU_QUERY, {
    variables: { ecapris_subproject_id: eCaprisID },
    fetchPolicy: "no-cache",
  });

  console.log(data?.ecapris_subproject_funding);

  // rows and rowModesModel used in DataGrid
  const [rows, setRows] = useState([]);

  // sets the data grid row data when query data is fetched
  useEffect(() => {
    if (data && data.ecapris_subproject_funding.length > 0) {
      setRows(data.ecapris_subproject_funding);
    }
  }, [data]);

  const [selectedFdus, setSelectedFdus] = useState([]);

  const dataGridColumns = useColumns();

  const handleAddFunding = useCallback(() => {
    const newFunds = [];
    // format record to match generic records added
    selectedFdus.forEach((fdu) => {
      const fduRecord = {};
      fduRecord.ecapris_funding_id = fdu.ecapris_funding_id;
      fduRecord.ecapris_subproject_id = eCaprisID;
      // fduRecord.fund_dept_unit = fdu.fdu;
      fduRecord.fdu = fdu.fdu;
      fduRecord.project_id = projectId;
      fduRecord.funding_amount = fdu.amount;
      // funding status 5 is "Set Up"
      fduRecord.funding_status_id = 5;
      newFunds.push(fduRecord);
    });

    // include records in mutation
    addProjectFunding({
      variables: {
        objects: newFunds,
      },
    })
      .then(() => {
        refetch().then(() => {
          handleDialogClose();
          handleSnackbar(true, "Funding source added", "success");
        });
      })
      .catch((error) => {
        handleSnackbar(true, "Error adding funding source", "error", error);
      });
    setSelectedFdus([]);
  }, [
    addProjectFunding,
    handleDialogClose,
    projectId,
    refetch,
    selectedFdus,
    handleSnackbar,
  ]);

  const handleRowSelection = useCallback(
    (selectedRows) => {
      const selectedFduRecords = selectedRows.map((fdu) =>
        rows.find((record) => record.fdu === fdu)
      );
      setSelectedFdus(selectedFduRecords);
    },
    [rows]
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
        {` Import from eCAPRIS subproject id ${eCaprisID}`}
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
          rows={rows}
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
          onProcessRowUpdateError={(error) =>
            handleSnackbar(true, "Error updating table", "error", error)
          }
          isRowSelectable={(row) =>
            !fdusArray.some((fdu) => fdu.fdu === row.id)
          }
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
