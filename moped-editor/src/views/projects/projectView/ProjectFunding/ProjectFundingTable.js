import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@apollo/client";
import isEqual from "lodash.isequal";

// Material
import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  Grid2,
  Switch,
  Tooltip,
  IconButton,
  Typography,
  Stack,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import {
  GridRowModes,
  useGridApiRef,
  gridColumnFieldsSelector,
} from "@mui/x-data-grid-pro";
import MopedDataGridInlineEdit from "src/components/DataGridPro/MopedDataGridInlineEdit";
import { v4 as uuidv4 } from "uuid";

import {
  COMBINED_FUNDING_QUERY,
  UPDATE_PROJECT_FUNDING,
  ADD_PROJECT_FUNDING,
  DELETE_PROJECT_FUNDING,
  GET_FUNDING_LOOKUPS,
} from "src/queries/funding";
import {
  CREATE_FILE_ECAPRIS_FUNDING_ATTACHMENT,
  DETACH_FILE_ECAPRIS_FUNDING_ATTACHMENT,
  PROJECT_UPDATE_ECAPRIS_FUNDING_SYNC,
} from "src/queries/project";

import FileUploadDialogSingle from "src/components/FileUpload/FileUploadDialogSingle";
import SubprojectFundingModal from "src/views/projects/projectView/ProjectFunding/SubprojectFundingModal";
import DataGridToolbar from "src/components/DataGridPro/DataGridToolbar";
import DeleteConfirmationModal from "src/views/projects/projectView/DeleteConfirmationModal";
import ProjectSummaryProjectECapris from "src/views/projects/projectView/ProjectSummary/ProjectSummaryProjectECapris";
import {
  getIsEditMode,
  handleRowEditStop,
} from "src/components/DataGridPro/utils/helpers.js";
import OverrideFundingDialog from "src/views/projects/projectView/ProjectFunding/OverrideFundingDialog";
import {
  transformDatabaseToGrid,
  transformGridToDatabase,
  isCellEditable,
  useColumns,
} from "src/views/projects/projectView/ProjectFunding/helpers";
import { useLogUserEvent } from "src/utils/userEvents";
import { LinkOff } from "@mui/icons-material";
import ProjectFileLink from "src/views/projects/projectView/ProjectFiles/ProjectFileLink";

// TODO: Rename existing file mutations so they don't include "attachments" in name (example: PROJECT_FILE_ATTACHMENTS)
// TODO: Handle if file is deleted - need to detach too. Detach in delete handler in ProjectFiles
// TODO: Handle if file override - need to have attachment copy to new record. Leave old association in case override is reverted.
// TODO: Add copy icon to network path files
// TODO: Ability to highlight row when navigating between files and funding tables.
//       - Example: click edit icon that directs to files table with associated file, highlight row of associated file.
//       - Example: click file that directs to funding table and highlight associated funding record row.
// TODO: Confirmation dialog when unlinking file with typical text plus that file will not be removed from project

const ProjectFundingTable = ({
  projectId,
  handleSnackbar,
  refetchProjectSummary,
  eCaprisSubprojectId = null,
  shouldSyncEcaprisFunding,
}) => {
  const apiRef = useGridApiRef();

  /* Query Moped and eCAPRIS funding with matching filters */
  const queryVariables =
    eCaprisSubprojectId && shouldSyncEcaprisFunding
      ? {
          projectFundingConditions: {
            project_id: { _eq: Number(projectId) },
          },
        }
      : {
          projectFundingConditions: {
            _and: [
              { project_id: { _eq: Number(projectId) } },
              { is_synced_from_ecapris: { _eq: false } },
            ],
          },
        };

  const {
    loading: loadingProjectFunding,
    data: dataProjectFunding,
    refetch,
  } = useQuery(COMBINED_FUNDING_QUERY, {
    variables: { ...queryVariables },
    fetchPolicy: "no-cache",
  });

  const tableFundingRows = useMemo(() => {
    const fundingRows = dataProjectFunding?.combined_project_funding_view;

    if (!fundingRows || fundingRows.length === 0) return [];

    const fundingRowsWithRelatedLookups = transformDatabaseToGrid(
      fundingRows,
      dataProjectFunding
    );
    return fundingRowsWithRelatedLookups;
  }, [dataProjectFunding]);

  const fdusArray = useMemo(() => {
    return tableFundingRows.map((row) => row.fdu) || [];
  }, [tableFundingRows]);

  const { loading: loadingLookups, data: dataLookups } = useQuery(
    GET_FUNDING_LOOKUPS,
    {
      fetchPolicy: "no-cache",
    }
  );

  const [addProjectFunding] = useMutation(ADD_PROJECT_FUNDING);
  const [updateProjectFunding] = useMutation(UPDATE_PROJECT_FUNDING);
  const [deleteProjectFunding] = useMutation(DELETE_PROJECT_FUNDING);
  const [updateShouldSyncECapris] = useMutation(
    PROJECT_UPDATE_ECAPRIS_FUNDING_SYNC
  );
  const logUserEvent = useLogUserEvent();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [overrideFundingRecord, setOverrideFundingRecord] = useState(null);
  // rows and rowModesModel used in DataGrid
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);
  const [usingShiftKey, setUsingShiftKey] = useState(false);
  const isEditMode = getIsEditMode(rowModesModel);

  const handleSubprojectDialogClose = () => {
    setIsDialogOpen(false);
    refetch();
  };

  const handleDeleteOpen = useCallback(
    (id) => () => {
      setIsDeleteConfirmationOpen(true);
      setDeleteConfirmationId(id);
    },
    []
  );

  // Open funding override modal when double clicking in a cell of a record from ecapris
  const doubleClickListener = (params) => {
    if (!params.row.is_manual) {
      logUserEvent("funding_ecapris_override_form_load");
      setOverrideFundingRecord(params.row);
    }
  };

  useEffect(() => {
    setRows(tableFundingRows);
  }, [tableFundingRows]);

  const handleTabKeyDown = React.useCallback(
    (params, event) => {
      if (params.cellMode === GridRowModes.Edit) {
        if (event.key === "Tab") {
          // Track whether the shift key is being used in combination with tab
          setUsingShiftKey(event.shiftKey);

          const columnFields = gridColumnFieldsSelector(apiRef).filter(
            (field) =>
              apiRef.current.isCellEditable(
                apiRef.current.getCellParams(params.id, field)
              )
          );

          // Always prevent going to the next element in the tab sequence because the focus is
          // handled manually to support edit components rendered inside Portals
          event.preventDefault();

          const index = columnFields.findIndex(
            (field) => field === params.field
          );
          const rowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(
            params.id
          );
          const nextFieldToFocus =
            columnFields[event.shiftKey ? index - 1 : index + 1];
          apiRef.current.setCellFocus(params.id, nextFieldToFocus);
          // if the column is not visible, bring it into view
          apiRef.current.scrollToIndexes({ rowIndex, colIndex: index + 1 });
        }
      }
    },
    [apiRef]
  );

  // adds a blank row to the table and updates the row modes model
  const handleAddRecordClick = () => {
    // use a random id to keep track of row in row modes model and data grid rows
    // before the record is added to the db
    const id = uuidv4();
    setRows((oldRows) => [
      {
        id,
        fund_source: null,
        fund_program: null,
        fund_status: null,
        funding_description: null,
        fdu: null,
        unit_long_name: null,
        ecapris_funding_id: null,
        funding_amount: null,
        isNew: true,
        proj_funding_id: id,
        is_manual: true,
      },
      ...oldRows,
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "fdu" },
    }));
  };

  const handleEditClick = useCallback(
    (id) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    },
    [rowModesModel]
  );

  const handleSaveClick = useCallback(
    (id) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    },
    [rowModesModel]
  );

  // handles row delete
  const handleDeleteClick = useCallback(
    (id) => () => {
      // remove row from rows in state
      setRows(rows.filter((row) => row.proj_funding_id !== id));

      const deletedRow = rows.find((row) => row.id === id);
      const { proj_funding_id } = deletedRow;

      // if the deleted row is in the db, delete from db
      if (!deletedRow.isNew) {
        deleteProjectFunding({
          variables: {
            proj_funding_id,
          },
        })
          .then(() => refetch())
          .then(() => {
            setIsDeleteConfirmationOpen(false);
            handleSnackbar(true, "Funding source deleted", "success");
          })
          .catch((error) => {
            handleSnackbar(
              true,
              "Error deleting funding source",
              "error",
              error
            );
          });
      }
    },
    [rows, deleteProjectFunding, refetch, handleSnackbar]
  );

  // when a user cancels editing by clicking the X in the actions
  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  /* File attachment state and handlers */
  const [addFundingFileAttachment] = useMutation(
    CREATE_FILE_ECAPRIS_FUNDING_ATTACHMENT
  );
  const [detachFundingFileAttachment] = useMutation(
    DETACH_FILE_ECAPRIS_FUNDING_ATTACHMENT
  );
  const [fileAttachmentId, setFileAttachmentId] = useState(null);
  const [isFileAttachmentDialogOpen, setIsFileAttachmentDialogOpen] =
    useState(false);
  const [isFileUnlinkConfirmationOpen, setIsFileUnlinkConfirmationOpen] =
    useState(false);

  const filesAttachedToId = useMemo(() => {
    const filesAttachedToId = rows
      .find((row) => row.id === fileAttachmentId)
      ?.ecapris_funding_files.map(
        (file_record) => file_record.moped_project_file
      );

    return filesAttachedToId ? filesAttachedToId : [];
  }, [fileAttachmentId, rows]);

  const handleAttachmentClick = useCallback(
    (id) => () => {
      setFileAttachmentId(id);
      setIsFileAttachmentDialogOpen(true);
    },
    []
  );

  /**
   * Persists the file data into the database
   * @param {Object} fileDataBundle - The file bundle as provided by the FileUpload component
   */
  const handleClickSaveFile = (fileDataBundle) => {
    const fundingRecord = rows.find((row) => row.id === fileAttachmentId);
    const entityId = fundingRecord?.proj_funding_id;

    addFundingFileAttachment({
      variables: {
        object: {
          project_id: projectId,
          file_name: fileDataBundle?.name,
          file_type: fileDataBundle?.type,
          file_description: fileDataBundle?.description,
          file_key: fileDataBundle?.key,
          file_size: fileDataBundle?.file?.fileSize ?? 0,
          file_url: fileDataBundle?.url,
          files_ecapris_fundings: {
            data: {
              project_id: projectId,
              entity_id: entityId,
            },
          },
        },
      },
    })
      .then(() => {
        setIsFileAttachmentDialogOpen(false);
        setFileAttachmentId(null);
        handleSnackbar(true, "File attachment linked", "success");
      })
      .catch((error) => {
        setFileAttachmentId(null);
        handleSnackbar(true, "Error linking file attachment", "error", error);
      })
      .finally(() => {
        refetch();
      });
  };

  const handleUnlinkFileAttachment = (id) => {
    const fundingRecord = rows.find((row) => row.id === fileAttachmentId);
    const entityId = fundingRecord?.proj_funding_id;

    detachFundingFileAttachment({
      variables: {
        fileId: id,
        entityId,
        projectId,
      },
    })
      .then(() => {
        setIsFileUnlinkConfirmationOpen(false);
        setFileAttachmentId(null);
        handleSnackbar(true, "File attachment unlinked", "success");
      })
      .catch((error) => {
        setIsFileUnlinkConfirmationOpen(false);
        setFileAttachmentId(null);
        handleSnackbar(true, "Error unlinking file attachment", "error", error);
      })
      .finally(() => {
        refetch();
      });
  };

  // saves row update, either editing an existing row or saving a new row
  const processRowUpdate = (updatedRow, originalRow) => {
    const mutationData = transformGridToDatabase(updatedRow);

    if (updatedRow.isNew) {
      return (
        addProjectFunding({
          variables: {
            objects: {
              ...mutationData,
              project_id: Number(projectId),
            },
          },
        })
          .then((response) => {
            // replace the temporary row id with the one proj funding id from the record creation
            const record_id =
              response.data.insert_moped_proj_funding.returning[0]
                .proj_funding_id;
            updatedRow.proj_funding_id = record_id;
          })
          .then(() => {
            refetch();
            handleSnackbar(true, "Funding source added", "success");
          })
          // from the data grid docs:
          // Please note that the processRowUpdate must return the row object to update the Data Grid internal state.
          .then(() => updatedRow)
          .catch((error) => {
            handleSnackbar(true, "Error adding funding source", "error", error);
          })
      );
    } else {
      // Remove __typename and check if the row has changed
      delete originalRow.__typename;
      delete updatedRow.__typename;
      const hasRowChanged = !isEqual(updatedRow, originalRow);

      if (!hasRowChanged) {
        return Promise.resolve(updatedRow);
      } else {
        return (
          updateProjectFunding({
            variables: {
              ...mutationData,
              proj_funding_id: updatedRow.proj_funding_id,
            },
          })
            .then(() => {
              refetch();
              handleSnackbar(true, "Funding source updated", "success");
            })
            // from the data grid docs:
            // Please note that the processRowUpdate must return the row object to update the Data Grid internal state.
            .then(() => updatedRow)
            .catch((error) => {
              handleSnackbar(
                true,
                "Error updating funding source",
                "error",
                error
              );
            })
        );
      }
    }
  };

  const refetchFundingData = useCallback(() => {
    refetch();
    refetchProjectSummary();
  }, [refetch, refetchProjectSummary]);

  const dataGridColumns = useColumns({
    dataProjectFunding,
    dataLookups,
    rowModesModel,
    handleDeleteOpen,
    handleSaveClick,
    handleCancelClick,
    handleEditClick,
    handleAttachmentClick,
    setOverrideFundingRecord,
    usingShiftKey,
    logUserEvent,
  });

  const handleECaprisSwitch = () => {
    logUserEvent(
      `funding_ecapris_sync_toggle_${!shouldSyncEcaprisFunding === false ? "off" : "on"}`
    );
    updateShouldSyncECapris({
      variables: {
        projectId: projectId,
        shouldSync: !shouldSyncEcaprisFunding,
      },
    })
      .then(() => {
        handleSnackbar(true, "eCAPRIS sync status updated", "success");
        refetchFundingData();
      })
      .catch((error) =>
        handleSnackbar(
          true,
          "Error updating eCAPRIS sync status",
          "error",
          error
        )
      );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <MopedDataGridInlineEdit
        loading={loadingProjectFunding || loadingLookups || !dataProjectFunding}
        apiRef={apiRef}
        columns={dataGridColumns}
        rows={rows}
        getRowId={(row) => row.id}
        rowModesModel={rowModesModel}
        onRowEditStop={handleRowEditStop(rows, setRows)}
        isCellEditable={isCellEditable}
        onRowModesModelChange={setRowModesModel}
        processRowUpdate={processRowUpdate}
        toolbar
        onCellKeyDown={handleTabKeyDown}
        onCellDoubleClick={doubleClickListener}
        localeText={{ noRowsLabel: "No funding sources" }}
        slots={{
          toolbar: DataGridToolbar,
        }}
        slotProps={{
          toolbar: {
            title: "Funding sources",
            primaryActionButton: (
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddRecordClick}
                startIcon={<AddCircleIcon />}
                disabled={isEditMode}
              >
                {"Add Manually"}
              </Button>
            ),
            secondaryActionButton: (
              <Button
                variant="outlined"
                onClick={() => {
                  logUserEvent("funding_ecapris_import_click");
                  setIsDialogOpen(true);
                }}
                startIcon={<AddCircleIcon />}
                disabled={!eCaprisSubprojectId || isEditMode}
              >
                {"Import from eCAPRIS"}
              </Button>
            ),
            documentationLink:
              "https://atd-dts.gitbook.io/moped-documentation/user-guides/add-funding-to-a-project",
            children: (
              <Grid2
                container
                direction="row"
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Grid2
                  size={{
                    xs: 6,
                    md: 4,
                  }}
                >
                  <ProjectSummaryProjectECapris
                    projectId={projectId}
                    eCaprisSubprojectId={eCaprisSubprojectId}
                    loading={loadingProjectFunding}
                    options={
                      dataProjectFunding?.ecapris_subproject_funding ?? []
                    }
                    refetch={refetchProjectSummary}
                    handleSnackbar={handleSnackbar}
                    disabled={isEditMode}
                  />
                </Grid2>
                <Grid2
                  container
                  sx={{
                    justifyContent: "flex-end",
                  }}
                  size={2}
                >
                  <Tooltip
                    placement="bottom"
                    title={
                      !eCaprisSubprojectId
                        ? "Add eCAPRIS subproject ID to enable syncing"
                        : isEditMode
                          ? "Save or cancel current edits first"
                          : null
                    }
                  >
                    <FormControlLabel
                      label="Sync from eCAPRIS"
                      control={
                        <Switch
                          variant="standard"
                          color="primary"
                          disabled={!eCaprisSubprojectId || isEditMode}
                          checked={shouldSyncEcaprisFunding}
                          onChange={handleECaprisSwitch}
                        />
                      }
                    />
                  </Tooltip>
                </Grid2>
              </Grid2>
            ),
          },
        }}
      />
      <DeleteConfirmationModal
        type={"funding source"}
        submitDelete={handleDeleteClick(deleteConfirmationId)}
        isDeleteConfirmationOpen={isDeleteConfirmationOpen}
        setIsDeleteConfirmationOpen={setIsDeleteConfirmationOpen}
      />
      {eCaprisSubprojectId && (
        <SubprojectFundingModal
          loading={loadingLookups}
          isDialogOpen={isDialogOpen}
          handleDialogClose={handleSubprojectDialogClose}
          eCaprisID={eCaprisSubprojectId}
          fdusArray={fdusArray}
          addProjectFunding={addProjectFunding}
          projectId={projectId}
          handleSnackbar={handleSnackbar}
          refetch={refetch}
        />
      )}
      {overrideFundingRecord && (
        <OverrideFundingDialog
          fundingRecord={overrideFundingRecord}
          projectId={projectId}
          refetchFundingQuery={refetch}
          setOverrideFundingRecord={setOverrideFundingRecord}
          onClose={() => setOverrideFundingRecord(null)}
          handleSnackbar={handleSnackbar}
          dataProjectFunding={dataProjectFunding}
        />
      )}
      {isFileAttachmentDialogOpen && (
        <FileUploadDialogSingle
          title={"Add file"}
          dialogOpen={isFileAttachmentDialogOpen}
          handleClickCloseUploadFile={() =>
            setIsFileAttachmentDialogOpen(false)
          }
          handleClickSaveFile={handleClickSaveFile}
          projectId={projectId}
          fileTypesLookup={dataLookups?.moped_file_types ?? []}
        >
          <Box>
            <Divider sx={{ marginY: 4 }} />
            <Stack direction="column">
              <Typography variant="h4" sx={{ mb: 1 }}>
                Attached files
              </Typography>

              {filesAttachedToId?.length > 0 ? (
                filesAttachedToId.map((file) => {
                  if (!file) return null;

                  return (
                    <>
                      <DeleteConfirmationModal
                        type="file attachment"
                        actionButtonText="Unlink"
                        actionButtonIcon={<LinkOff />}
                        submitDelete={() =>
                          handleUnlinkFileAttachment(file.project_file_id)
                        }
                        isDeleteConfirmationOpen={isFileUnlinkConfirmationOpen}
                        setIsDeleteConfirmationOpen={
                          setIsFileUnlinkConfirmationOpen
                        }
                      />
                      <Stack
                        direction="row"
                        sx={{
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                        key={file.project_file_id}
                        spacing={0.5}
                      >
                        <Box>
                          <IconButton
                            onClick={() =>
                              setIsFileUnlinkConfirmationOpen(true)
                            }
                            size="small"
                          >
                            <LinkOff />
                          </IconButton>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <ProjectFileLink
                            file_key={file?.file_key}
                            file_url={file?.file_url}
                          />
                        </Box>
                      </Stack>
                    </>
                  );
                })
              ) : (
                <Typography variant="body2">No files attached</Typography>
              )}
            </Stack>
          </Box>
        </FileUploadDialogSingle>
      )}
    </div>
  );
};

export default ProjectFundingTable;
