import React, { useMemo } from "react";
import { Box, Tooltip } from "@mui/material";
import { GridRow } from "@mui/x-data-grid-pro";
import MopedDataGrid from "src/components/DataGridPro/MopedDataGrid";
import ProjectFileLink from "src/views/projects/projectView/ProjectFiles/ProjectFileLink";
import { useQuery } from "@apollo/client";
import { PROJECT_FILE_ATTACHMENTS } from "src/queries/project";

const PAGE_SIZE = 10;

/**
 * Custom row component that shows a tooltip when the row is disabled
 * (i.e., when the file is already attached to the funding row)
 */
const CustomRow = (props) => {
  const { attachedFiles, ...rowProps } = props;
  const isDisabled = attachedFiles?.some(
    (file) => file?.moped_project_file?.project_file_id === rowProps.rowId
  );

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
        width: 300,
      },
      {
        headerName: "File",
        field: "file",
        width: 500,
        display: "flex",
        renderCell: ({ row }) => (
          // Box wrapper workaround for ProjectFileLink styles not applying properly within flex cell needed to center align
          <Box sx={{ minWidth: 0, overflow: "hidden", width: "100%" }}>
            <ProjectFileLink
              fileKey={row?.file_key}
              fileUrl={row?.file_url}
              fileName={row?.file_url} // Pass url as fileName to match edit cell value
            />
          </Box>
        ),
      },
    ];
  }, []);

const AttachExistingFileTable = ({
  projectId,
  handleRowSelection,
  attachedFiles = [],
}) => {
  const { loading, data } = useQuery(PROJECT_FILE_ATTACHMENTS, {
    variables: { projectId },
    fetchPolicy: "no-cache",
  });

  const rows = useMemo(
    () => data?.moped_project_files ?? [],
    [data?.moped_project_files]
  );

  const dataGridColumns = useColumns();

  return (
    <Box sx={{ width: "100%", pt: 2 }}>
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
        disableMultipleRowSelection
        onRowSelectionModelChange={handleRowSelection}
        isRowSelectable={(row) =>
          !attachedFiles.some(
            (file) => file?.moped_project_file?.project_file_id === row.id
          )
        }
        slots={{ row: CustomRow }}
        slotProps={{ row: { attachedFiles } }}
        loading={loading}
      />
    </Box>
  );
};
export default AttachExistingFileTable;
