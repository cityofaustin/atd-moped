import React, { useState, useMemo, useEffect, useCallback } from "react";
import { type ApolloQueryResult, useQuery, useMutation } from "@apollo/client";
import { type ProjectSummaryQuery } from "src/gql/graphql";
import isEqual from "lodash.isequal";

import { Button, FormControlLabel, Grid, Switch, Tooltip } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import {
  GridRowModes,
  type GridEventListener,
  useGridApiRef,
  gridColumnFieldsSelector,
  GridRowId,
  type GridRowModesModel,
} from "@mui/x-data-grid-pro";
import MopedDataGridInlineEdit from "src/components/DataGridPro/MopedDataGridInlineEdit";
import { v4 as uuidv4 } from "uuid";

import {
  COMBINED_FUNDING_QUERY,
  UPDATE_PROJECT_FUNDING,
  ADD_PROJECT_FUNDING,
  DELETE_PROJECT_FUNDING,
  GET_FUNDING_LOOKUPS,
  DELETE_PROJECT_FUNDING_AND_REATTACH,
} from "src/queries/funding";
import {
  PROJECT_UPDATE_ECAPRIS_FUNDING_SYNC,
  CREATE_FILE_ECAPRIS_FUNDING_ATTACHMENT,
  CREATE_FILE_MOPED_FUNDING_ATTACHMENT,
  ATTACH_EXISTING_FILE_TO_ECAPRIS_FUNDING,
  ATTACH_EXISTING_FILE_TO_MOPED_FUNDING,
} from "src/queries/project";

import SubprojectFundingModal from "src/views/projects/projectView/ProjectFunding/SubprojectFundingModal";
import DataGridToolbar from "src/components/DataGridPro/DataGridToolbar";
import DeleteConfirmationModal from "src/views/projects/projectView/DeleteConfirmationModal";
import ProjectSummaryProjectECapris from "src/views/projects/projectView/ProjectSummary/ProjectSummaryProjectECapris";
import {
  getIsEditMode,
  handleRowEditStop,
} from "src/components/DataGridPro/utils/helpers";
import OverrideFundingDialog from "src/views/projects/projectView/ProjectFunding/OverrideFundingDialog";
import ProjectFilesAttachmentDialog from "src/components/ProjectFilesAttachmentDialog";
import {
  transformDatabaseToGrid,
  transformGridToInsertInput,
  transformGridToUpdateInput,
  isCellEditable,
  useColumns,
  createFundingFileConnectionData,
  type FundingRowForGrid,
  type DraftFundingRow,
} from "src/views/projects/projectView/ProjectFunding/helpers";
import { useLogUserEvent } from "src/utils/userEvents";
import { type HandleSnackbar } from "src/components/useFeedbackSnackbar";

interface ProjectFundingTableProps {
  /** The project ID for which to display funding. */
  projectId: number;
  /** Function to handle snackbar notifications for user feedback. */
  handleSnackbar: HandleSnackbar;
  /** Function to refetch the project summary data. */
  refetchProjectSummary: () => Promise<ApolloQueryResult<ProjectSummaryQuery>>;
  /** The eCAPRIS subproject ID associated with the project, if any. */
  eCaprisSubprojectId: string | null;
  /** Whether to sync eCAPRIS funding controlled on the project level. */
  shouldSyncEcaprisFunding: boolean;
}

const ProjectFundingTable = ({
  projectId,
  handleSnackbar,
  refetchProjectSummary,
  eCaprisSubprojectId = null,
  shouldSyncEcaprisFunding,
}: ProjectFundingTableProps) => {
  const apiRef = useGridApiRef();

  /* Query Moped and eCAPRIS funding with matching filters */
  const queryVariables = useMemo(() => {
    return eCaprisSubprojectId && shouldSyncEcaprisFunding
      ? {
          projectFundingConditions: {
            project_id: { _eq: projectId },
          },
        }
      : {
          projectFundingConditions: {
            _and: [
              { project_id: { _eq: projectId } },
              { is_synced_from_ecapris: { _eq: false } },
            ],
          },
        };
  }, [projectId, eCaprisSubprojectId, shouldSyncEcaprisFunding]);

  const {
    loading: loadingProjectFunding,
    data: dataProjectFunding,
    refetch,
  } = useQuery(COMBINED_FUNDING_QUERY, {
    variables: queryVariables,
    fetchPolicy: "no-cache",
  });

  const tableFundingRows = useMemo(() => {
    if (!dataProjectFunding) return [];

    const fundingRows = dataProjectFunding.combined_project_funding_view;

    if (fundingRows.length === 0) return [];

    const fundingGridRows = transformDatabaseToGrid(fundingRows);
    return fundingGridRows;
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

  /* Mutations for adding, editing, deleting funding records, and updating eCAPRIS sync status */
  const [addProjectFunding] = useMutation(ADD_PROJECT_FUNDING);
  const [updateProjectFunding] = useMutation(UPDATE_PROJECT_FUNDING);
  const [deleteProjectFunding, { loading: mutationPending }] = useMutation(
    DELETE_PROJECT_FUNDING
  );
  const [
    deleteProjectFundingAndReattach,
    { loading: mutationPendingReattach },
  ] = useMutation(DELETE_PROJECT_FUNDING_AND_REATTACH);
  const [updateShouldSyncECapris] = useMutation(
    PROJECT_UPDATE_ECAPRIS_FUNDING_SYNC
  );
  const logUserEvent = useLogUserEvent();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [overrideFundingRecord, setOverrideFundingRecord] =
    useState<FundingRowForGrid | null>(null);
  // rows and rowModesModel used in DataGrid
  const [rows, setRows] = useState<FundingRowForGrid[]>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [deleteConfirmationId, setDeleteConfirmationId] =
    useState<GridRowId | null>(null);
  const [usingShiftKey, setUsingShiftKey] = useState(false);
  const isEditMode = getIsEditMode(rowModesModel);

  /* File attachment state and handlers */
  const [fileAttachmentId, setFileAttachmentId] = useState<GridRowId | null>(
    null
  );
  const [isFileAttachmentDialogOpen, setIsFileAttachmentDialogOpen] =
    useState(false);

  const handleFileAttachmentClick = useCallback(
    (id: GridRowId) => () => {
      setFileAttachmentId(id);
      setIsFileAttachmentDialogOpen(true);
    },
    []
  );

  /**
   * Finds funding record in table that corresponds to the row id of row interacting with the file attachment dialog
   */
  const fileAttachmentParentRecord = useMemo(
    () => rows.find((row) => row.id === fileAttachmentId),
    [rows, fileAttachmentId]
  );

  const handleSubprojectDialogClose = () => {
    setIsDialogOpen(false);
    refetch();
  };

  const handleDeleteOpen = useCallback(
    (id: GridRowId) => () => {
      setIsDeleteConfirmationOpen(true);
      setDeleteConfirmationId(id);
    },
    []
  );

  // Open funding override modal when double clicking in a cell of a record from ecapris
  const doubleClickListener: GridEventListener<"cellDoubleClick"> = (
    params
  ) => {
    if (!params.row.is_manual) {
      logUserEvent("funding_ecapris_override_form_load");
      setOverrideFundingRecord(params.row);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- rows state is also used for optimistic updates after mutations; refactor in issue #28901
    setRows(tableFundingRows);
  }, [tableFundingRows]);

  const handleTabKeyDown: GridEventListener<"cellKeyDown"> = React.useCallback(
    (params, event) => {
      if (params.cellMode === GridRowModes.Edit) {
        if (event.key === "Tab") {
          // Track whether the shift key is being used in combination with tab
          setUsingShiftKey(event.shiftKey);

          const columnFields = gridColumnFieldsSelector(apiRef).filter(
            (field) =>
              apiRef.current?.isCellEditable(
                apiRef.current?.getCellParams(params.id, field)
              )
          );

          // Always prevent going to the next element in the tab sequence because the focus is
          // handled manually to support edit components rendered inside Portals
          event.preventDefault();

          const index = columnFields.findIndex(
            (field) => field === params.field
          );
          const rowIndex = apiRef.current?.getRowIndexRelativeToVisibleRows(
            params.id
          );
          const nextFieldToFocus =
            columnFields[event.shiftKey ? index - 1 : index + 1];
          apiRef.current?.setCellFocus(params.id, nextFieldToFocus);
          // if the column is not visible, bring it into view
          apiRef.current?.scrollToIndexes({ rowIndex, colIndex: index + 1 });
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
        moped_fund_source: null,
        moped_fund_program: null,
        moped_fund_status: null,
        funding_description: null,
        fdu: null,
        unit_long_name: null,
        ecapris_funding_id: null,
        funding_amount: null,
        isNew: true,
        proj_funding_id: id,
        is_manual: true,
      } satisfies DraftFundingRow,
      ...oldRows,
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "fdu" },
    }));
  };

  const handleEditClick = useCallback(
    (id: GridRowId) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    },
    [rowModesModel]
  );

  const handleSaveClick = useCallback(
    (id: GridRowId) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    },
    [rowModesModel]
  );

  const handleDeleteClick = useCallback(
    (id: GridRowId) => () => {
      // remove row from rows in state
      setRows(rows.filter((row) => row.proj_funding_id !== id));

      const deletedRow = rows.find((row) => row.id === id);
      if (!deletedRow) return;
      if (deletedRow.isNew) return;
      if (!deletedRow.proj_funding_id) return; // Combined funding rows from eCAPRIS don't have project_funding_id

      const { proj_funding_id, is_manual, is_synced_from_ecapris } = deletedRow;
      const isDeletingOverride = !is_manual && !is_synced_from_ecapris;

      if (isDeletingOverride) {
        // Gather file attachments so they can be reattached to synced eCAPRIS FDU when override is deleted
        const fileIds =
          deletedRow.moped_funding_files?.map(
            (file) => file.moped_project_file.project_file_id
          ) ?? [];
        const entity_id = deletedRow.ecapris_funding?.id;

        if (!entity_id) {
          console.error(
            "Overrides must have an ecapris_subproject_funding primary key",
            { projectId, deletedRow }
          );
          return;
        }

        const attachmentObjects = fileIds.map((fileId) => ({
          file_id: fileId,
          project_id: projectId,
          entity_id,
          is_deleted: false,
        }));

        deleteProjectFundingAndReattach({
          variables: {
            proj_funding_id,
            attachmentObjects,
          },
        })
          .then(() => refetch())
          .then(() => {
            setIsDeleteConfirmationOpen(false);
            handleSnackbar(
              true,
              "Funding source override deleted and eCAPRIS FDU restored",
              "success"
            );
          })
          .catch((error) => {
            handleSnackbar(
              true,
              "Error deleting funding source",
              "error",
              error
            );
          });
      } else {
        deleteProjectFunding({ variables: { proj_funding_id } })
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
    [
      rows,
      deleteProjectFunding,
      refetch,
      handleSnackbar,
      projectId,
      deleteProjectFundingAndReattach,
    ]
  );

  // when a user cancels editing by clicking the X in the actions
  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
    const editedRow = rows.find((row) => row.id === id);
    if (editedRow && editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  // saves row update, either editing an existing row or saving a new row
  const processRowUpdate = (
    updatedRow: FundingRowForGrid,
    originalRow: FundingRowForGrid
  ): Promise<FundingRowForGrid> => {
    if (updatedRow.isNew) {
      const insertMutationData = transformGridToInsertInput(updatedRow);

      return (
        addProjectFunding({
          variables: {
            fundingObjects: {
              ...insertMutationData,
              project_id: projectId,
            },
          },
        })
          .then((response) => {
            // replace the temporary row id with the one proj funding id from the record creation
            const record_id =
              response.data?.insert_moped_proj_funding?.returning[0]
                .proj_funding_id;

            return {
              ...updatedRow,
              proj_funding_id: String(record_id),
            };
          })
          // from the data grid docs:
          // Please note that the processRowUpdate must return the row object to update the Data Grid internal state.
          .then((row) => {
            refetch();
            handleSnackbar(true, "Funding source added", "success");
            return row;
          })
          .catch((error) => {
            handleSnackbar(true, "Error adding funding source", "error", error);
            return originalRow;
          })
      );
    } else {
      const hasRowChanged = !isEqual(updatedRow, originalRow);

      if (!hasRowChanged) {
        return Promise.resolve(updatedRow);
      } else {
        if (updatedRow.proj_funding_id === null)
          return Promise.resolve(updatedRow);
        const updateMutationData = transformGridToUpdateInput(updatedRow);

        return (
          updateProjectFunding({
            variables: {
              ...updateMutationData,
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
              return originalRow;
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
    dataLookups,
    rowModesModel,
    handleDeleteOpen,
    handleSaveClick,
    handleCancelClick,
    handleEditClick,
    handleFileAttachmentClick,
    setOverrideFundingRecord,
    usingShiftKey,
    logUserEvent,
    refetch,
    handleSnackbar,
    shouldSyncEcaprisFunding,
    projectECaprisSubprojectId: eCaprisSubprojectId,
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
      <MopedDataGridInlineEdit<FundingRowForGrid>
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
          // @ts-expect-error Replace DataGridToolbar with Toolbar and migrate; captured in issue #29887
          toolbar: DataGridToolbar,
        }}
        slotProps={{
          toolbar: {
            title: "Funding sources",
            // @ts-expect-error Replace DataGridToolbar with Toolbar and migrate; captured in issue #29887
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
              <Grid
                container
                direction="row"
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Grid
                  size={{
                    xs: 6,
                    md: 4,
                  }}
                >
                  {/* @ts-expect-error Migrating ProjectSummaryProjectECapris to TS captured in issue #29889 */}
                  <ProjectSummaryProjectECapris
                    projectId={projectId}
                    eCaprisSubprojectId={eCaprisSubprojectId}
                    loading={loadingProjectFunding}
                    options={dataLookups?.ecapris_options ?? []}
                    refetch={refetchFundingData}
                    handleSnackbar={handleSnackbar}
                    disabled={isEditMode}
                  />
                </Grid>
                <Grid
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
                          color="primary"
                          disabled={!eCaprisSubprojectId || isEditMode}
                          checked={shouldSyncEcaprisFunding}
                          onChange={handleECaprisSwitch}
                        />
                      }
                    />
                  </Tooltip>
                </Grid>
              </Grid>
            ),
          },
        }}
      />
      {deleteConfirmationId !== null && (
        // @ts-expect-error Migrating DeleteConfirmationModal to TS captured in issue #29890
        <DeleteConfirmationModal
          type={"funding source"}
          submitDelete={handleDeleteClick(deleteConfirmationId)}
          isDeleteConfirmationOpen={isDeleteConfirmationOpen}
          setIsDeleteConfirmationOpen={setIsDeleteConfirmationOpen}
          mutationPending={mutationPending || mutationPendingReattach}
        />
      )}
      {eCaprisSubprojectId && (
        <SubprojectFundingModal
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
          handleClose={() => setOverrideFundingRecord(null)}
          handleSnackbar={handleSnackbar}
          dataLookups={dataLookups}
        />
      )}
      {isFileAttachmentDialogOpen && fileAttachmentParentRecord && (
        // @ts-expect-error Migrating ProjectFilesAttachmentDialog to TS captured in issue #29892
        <ProjectFilesAttachmentDialog
          projectId={projectId}
          isFileAttachmentDialogOpen={isFileAttachmentDialogOpen}
          handleSnackbar={handleSnackbar}
          onClose={() => {
            setIsFileAttachmentDialogOpen(false);
            setFileAttachmentId(null);
          }}
          refetch={refetch}
          dataLookups={dataLookups}
          fileAttachmentParentRecord={fileAttachmentParentRecord}
          fileConnectionData={createFundingFileConnectionData(
            fileAttachmentParentRecord,
            projectId
          )}
          addFileMutation={
            !fileAttachmentParentRecord.isNew &&
            fileAttachmentParentRecord?.is_synced_from_ecapris
              ? CREATE_FILE_ECAPRIS_FUNDING_ATTACHMENT
              : CREATE_FILE_MOPED_FUNDING_ATTACHMENT
          }
          existingFileMutation={
            !fileAttachmentParentRecord.isNew &&
            fileAttachmentParentRecord?.is_synced_from_ecapris
              ? ATTACH_EXISTING_FILE_TO_ECAPRIS_FUNDING
              : ATTACH_EXISTING_FILE_TO_MOPED_FUNDING
          }
          filesType={
            !fileAttachmentParentRecord.isNew &&
            fileAttachmentParentRecord?.is_synced_from_ecapris
              ? "ecapris_funding_files"
              : "moped_funding_files"
          }
        />
      )}
    </div>
  );
};

export default ProjectFundingTable;
