import React, { useCallback, useMemo, useState } from "react";
import { Button, Box, Tooltip } from "@mui/material";
import { GridRow } from "@mui/x-data-grid-pro";
import MopedDataGrid from "src/components/DataGridPro/MopedDataGrid";
import ProjectFileLink from "src/views/projects/projectView/ProjectFiles/ProjectFileLink";
import AddCircle from "@mui/icons-material/AddCircle";
import { useQuery } from "@apollo/client";
import { PROJECT_FILE_ATTACHMENTS } from "src/queries/project";

const PAGE_SIZE = 10;

/**
 * Custom row component that shows a tooltip when the row is disabled
 * (i.e., when the file is already attached to the funding row)
 */
const CustomRow = (props) => {
  const { fdusArray, ...rowProps } = props;
  const isDisabled = fdusArray?.some((fdu) => fdu?.fdu === rowProps.rowId);

  if (isDisabled) {
    return (
      <Tooltip title="File already attached" placement="top" arrow>
        <div>
          <GridRow {...rowProps} />
        </div>
      </Tooltip>
    );
  }

  return <GridRow {...rowProps} />;
};

const useColumns = () =>
  useMemo(() => {
    return [
      {
        headerName: "Name",
        field: "file_name",
        display: "flex",
        flex: 1,
      },
      {
        headerName: "File",
        field: "unit_long_name",
        display: "flex",
        flex: 1,
        renderCell: ({ row }) => (
          <ProjectFileLink
            fileKey={row?.file_key}
            fileUrl={row?.file_url}
            fileName={row?.file_url} // Pass url as fileName to match edit cell value
          />
        ),
      },
    ];
  }, []);

const AttachExistingFileTable = ({
  handleDialogClose,
  fdusArray = [],
  addProjectFunding,
  projectId,
  handleSnackbar,
  refetch,
}) => {
  const { loading, data } = useQuery(PROJECT_FILE_ATTACHMENTS, {
    variables: { projectId },
    fetchPolicy: "no-cache",
  });

  const rows = useMemo(
    () => data?.moped_project_files ?? [],
    [data?.moped_project_files]
  );

  const [selectedFdus, setSelectedFdus] = useState([]);

  const dataGridColumns = useColumns();

  const handleAttach = () => {
    console.log("Attaching file");
    // const newFunds = [];
    // // format record to match generic records added
    // selectedFdus.forEach((fdu) => {
    //   const fduRecord = {};
    //   fduRecord.ecapris_funding_id = fdu.ecapris_funding_id; // fao_id
    //   fduRecord.ecapris_subproject_id = eCaprisID;
    //   fduRecord.fdu = fdu.fdu;
    //   fduRecord.project_id = projectId;
    //   fduRecord.funding_amount = fdu.amount;
    //   fduRecord.unit_long_name = fdu.unit_long_name;
    //   // All imports start as synced from eCAPRIS amounts
    //   fduRecord.should_use_ecapris_amount = true;
    //   // funding status 5 is "Set Up"
    //   fduRecord.funding_status_id = 5;
    //   fduRecord.funding_program_id = fdu.funding_program_id;
    //   fduRecord.funding_source_id = fdu.funding_source_id;
    //   newFunds.push(fduRecord);
    // });

    // // include records in mutation
    // addProjectFunding({
    //   variables: {
    //     objects: newFunds,
    //   },
    // })
    //   .then(() => {
    //     refetch().then(() => {
    //       handleDialogClose();
    //       handleSnackbar(true, "Funding source added", "success");
    //     });
    //   })
    //   .catch((error) => {
    //     handleSnackbar(true, "Error adding funding source", "error", error);
    //   });
    // setSelectedFdus([]);
  };

  //   const handleAddFunding = useCallback(() => {
  //     console.log("Attaching file")
  // const newFunds = [];
  // // format record to match generic records added
  // selectedFdus.forEach((fdu) => {
  //   const fduRecord = {};
  //   fduRecord.ecapris_funding_id = fdu.ecapris_funding_id; // fao_id
  //   fduRecord.ecapris_subproject_id = eCaprisID;
  //   fduRecord.fdu = fdu.fdu;
  //   fduRecord.project_id = projectId;
  //   fduRecord.funding_amount = fdu.amount;
  //   fduRecord.unit_long_name = fdu.unit_long_name;
  //   // All imports start as synced from eCAPRIS amounts
  //   fduRecord.should_use_ecapris_amount = true;
  //   // funding status 5 is "Set Up"
  //   fduRecord.funding_status_id = 5;
  //   fduRecord.funding_program_id = fdu.funding_program_id;
  //   fduRecord.funding_source_id = fdu.funding_source_id;
  //   newFunds.push(fduRecord);
  // });

  // // include records in mutation
  // addProjectFunding({
  //   variables: {
  //     objects: newFunds,
  //   },
  // })
  //   .then(() => {
  //     refetch().then(() => {
  //       handleDialogClose();
  //       handleSnackbar(true, "Funding source added", "success");
  //     });
  //   })
  //   .catch((error) => {
  //     handleSnackbar(true, "Error adding funding source", "error", error);
  //   });
  // setSelectedFdus([]);
  //   }, [
  //     addProjectFunding,
  //     handleDialogClose,
  //     projectId,
  //     refetch,
  //     eCaprisID,
  //     selectedFdus,
  //     handleSnackbar,
  //   ]);

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
    <>
      <MopedDataGrid
        autoHeight
        columns={dataGridColumns}
        disableColumnMenu
        rows={rows}
        getRowId={(row) => row.project_file_id}
        hideFooter={false}
        initialState={{
          pagination: {
            paginationModel: { pageSize: PAGE_SIZE, page: 0 },
          },
        }}
        pagination
        pageSizeOptions={[PAGE_SIZE]}
        disableRowSelectionOnClick={false}
        localeText={{ noRowsLabel: "No files available" }}
        checkboxSelection
        onRowSelectionModelChange={handleRowSelection}
        isRowSelectable={(row) => !fdusArray.some((fdu) => fdu?.fdu === row.id)}
        slots={{ row: CustomRow }}
        slotProps={{ row: { fdusArray } }}
        loading={loading}
      />
      <Box
        sx={{
          my: 3,
          display: "flex",
          flexDirection: "row-reverse",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          size="medium"
          startIcon={<AddCircle />}
          onClick={handleAttach}
          disabled={!selectedFdus.length}
        >
          Attach
        </Button>
      </Box>
    </>
  );
};
export default AttachExistingFileTable;
