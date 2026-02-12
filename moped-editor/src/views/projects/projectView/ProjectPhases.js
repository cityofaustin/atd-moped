import { useCallback, useMemo, useState } from "react";
import { useMutation } from "@apollo/client";
import { CircularProgress, Box, IconButton, Button } from "@mui/material";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { green } from "@mui/material/colors";
import {
  EditOutlined as EditOutlinedIcon,
  DeleteOutline as DeleteOutlineIcon,
  CheckCircleOutline,
  AddCircle as AddCircleIcon,
} from "@mui/icons-material";
import DataGridToolbar from "src/components/DataGridPro/DataGridToolbar";
import ProjectSubstantialCompletionDate from "src/views/projects/projectView/ProjectPhase/ProjectSubstantialCompletionDate";
import PhaseTemplateModal from "./ProjectPhase/PhaseTemplateModal";
import ProjectPhaseDialog from "./ProjectPhase/ProjectPhaseDialog";
import ProjectPhaseDateConfirmationPopover from "./ProjectPhase/ProjectPhaseDateConfirmationPopover";
import { DELETE_PROJECT_PHASE } from "src/queries/project";
import {
  useCurrentProjectPhaseID,
  useCurrentPhaseId,
  usePhaseNameLookup,
  useSubphaseNameLookup,
} from "./ProjectPhase/helpers";
import dataGridProStyleOverrides from "src/styles/dataGridProStylesOverrides";
import DeleteConfirmationModal from "src/views/projects/projectView/DeleteConfirmationModal";
import CurrentPhaseDeleteModal from "src/views/projects/projectView/ProjectPhase/CurrentPhaseDeleteModal";

/** Hook that provides memoized column settings */
const useColumns = ({ deleteInProgress, handleDeleteOpen, setEditPhase }) =>
  useMemo(() => {
    return [
      {
        headerName: "Phase",
        field: "moped_phase",
        width: 200,
        valueGetter: (value) => value?.phase_name,
      },
      {
        headerName: "Subphase",
        field: "moped_subphase",
        width: 200,
        valueGetter: (value) => value?.subphase_name,
      },
      {
        headerName: "Start",
        field: "phase_start",
        type: "date",
        /** valueGetter is used by the date sort function inherently used by the `date` type column */
        valueGetter: (value) => (value ? new Date(value) : null),
        /**  the renderCell function controls the react node rendered for this cell */
        renderCell: ({ row }) => {
          let strToRender = row.phase_start
            ? new Date(row.phase_start).toLocaleDateString()
            : "";

          const showNotConfirmedIndicator =
            !row.is_phase_start_confirmed && strToRender;

          strToRender = showNotConfirmedIndicator
            ? `${strToRender}*`
            : strToRender;
          return (
            <ProjectPhaseDateConfirmationPopover
              isEnabled={showNotConfirmedIndicator}
              dateType="start"
            >
              <span>{strToRender}</span>
            </ProjectPhaseDateConfirmationPopover>
          );
        },
        width: 150,
      },
      {
        headerName: "End",
        field: "phase_end",
        type: "date",
        /** valueGetter is used by the date sort function inherently used by the `date` type column */
        valueGetter: (value) => (value ? new Date(value) : null),
        /**  the renderCell function controls the react node rendered for this cell */
        renderCell: ({ row }) => {
          let strToRender = row.phase_end
            ? new Date(row.phase_end).toLocaleDateString()
            : "";

          const showNotConfirmedIndicator =
            !row.is_phase_end_confirmed && strToRender;

          strToRender = showNotConfirmedIndicator
            ? `${strToRender}*`
            : strToRender;
          return (
            <ProjectPhaseDateConfirmationPopover
              isEnabled={showNotConfirmedIndicator}
              dateType="end"
            >
              <span>{strToRender}</span>
            </ProjectPhaseDateConfirmationPopover>
          );
        },
        width: 150,
      },
      {
        headerName: "Description",
        field: "phase_description",
        width: 300,
      },
      {
        headerName: "Current",
        field: "is_current_phase",
        minWidth: 50,
        renderCell: ({ row }) =>
          row.is_current_phase ? (
            <Box display="flex">
              <CheckCircleOutline style={{ color: green[500] }} />
            </Box>
          ) : (
            ""
          ),
      },
      {
        headerName: "",
        field: "_edit",
        sortable: false,
        width: 100,
        renderCell: ({ row }) => {
          return deleteInProgress ? (
            <CircularProgress color="primary" size={20} />
          ) : (
            <div style={{ display: "flex" }}>
              <IconButton
                aria-label="edit"
                sx={{ color: "inherit" }}
                onClick={() => setEditPhase(row)}
              >
                <EditOutlinedIcon />
              </IconButton>
              <IconButton
                aria-label="delete"
                sx={{ color: "inherit" }}
                onClick={() =>
                  handleDeleteOpen({
                    project_phase_id: row.project_phase_id,
                    is_current_phase: row.is_current_phase,
                  })
                }
              >
                <DeleteOutlineIcon />
              </IconButton>
            </div>
          );
        },
      },
    ];
  }, [deleteInProgress, handleDeleteOpen, setEditPhase]);

/**
 * ProjectPhases Component - renders Project Phase table
 * @return {JSX.Element}
 * @constructor
 */
const ProjectPhases = ({
  projectId,
  data,
  loading,
  refetch,
  handleSnackbar,
}) => {
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [editPhase, setEditPhase] = useState(null);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);
  const [isDeleteCurrentConfirmationOpen, setIsDeleteCurrentConfirmationOpen] =
    useState(false);

  const [deletePhase, { loading: deleteInProgress }] =
    useMutation(DELETE_PROJECT_PHASE);

  const onClickAddPhase = () => setEditPhase({ project_id: projectId });

  const handleDeleteOpen = useCallback(
    ({ project_phase_id, is_current_phase }) => {
      if (is_current_phase) {
        setIsDeleteCurrentConfirmationOpen(true);
      } else {
        setIsDeleteConfirmationOpen(true);
        setDeleteConfirmationId(project_phase_id);
      }
    },
    []
  );

  const handleDeleteClick = useCallback(
    (id) => () => {
      deletePhase({
        variables: { project_phase_id: id },
        refetchQueries: ["ProjectSummary"],
      })
        .then(() => {
          refetch();
          handleSnackbar(true, "Project phase deleted", "success");
        })
        .then(() => setIsDeleteConfirmationOpen(false))
        .catch((error) => {
          handleSnackbar(true, "Error deleting project phase", "error", error);
        });
    },
    [deletePhase, refetch, handleSnackbar]
  );

  const columns = useColumns({
    setEditPhase,
    deleteInProgress,
    handleDeleteOpen,
  });

  const currentProjectPhaseId = useCurrentProjectPhaseID(
    data?.moped_proj_phases
  );

  const currentPhaseTypeId = useCurrentPhaseId(data?.moped_proj_phases);

  const phaseNameLookup = usePhaseNameLookup(data?.moped_phases || []);

  const subphaseNameLookup = useSubphaseNameLookup(data?.moped_subphases || []);

  const completionDate =
    data?.project_list_view[0]["substantial_completion_date"];

  const onSubmitCallback = (isNewPhase) => {
    refetch().then(() => {
      isNewPhase
        ? handleSnackbar(true, "Project phase added", "success")
        : handleSnackbar(true, "Project phase updated", "success");
      setEditPhase(null);
    });
  };

  // Open activity edit modal when double clicking in a cell
  const doubleClickListener = (params) => {
    setEditPhase(params.row);
  };

  return (
    <>
      <DataGridPro
        sx={dataGridProStyleOverrides}
        autoHeight
        columns={columns}
        density="comfortable"
        getRowId={(row) => row.project_phase_id}
        disableRowSelectionOnClick
        disableColumnMenu
        getRowHeight={() => "auto"}
        hideFooter
        localeText={{ noRowsLabel: "No phases" }}
        initialState={{ pinnedColumns: { right: ["_edit"] } }}
        rows={data?.moped_proj_phases || []}
        loading={loading || !data}
        onCellDoubleClick={doubleClickListener}
        slots={{
          toolbar: DataGridToolbar,
        }}
        slotProps={{
          toolbar: {
            title: "Phases",
            primaryActionButton: (
              <Button
                variant="contained"
                color="primary"
                onClick={onClickAddPhase}
                startIcon={<AddCircleIcon />}
              >
                {"Add phase"}
              </Button>
            ),
            secondaryActionButton: (
              <Button
                variant="outlined"
                onClick={() => setIsTemplateDialogOpen(true)}
                startIcon={<AddCircleIcon />}
              >
                {"From template"}
              </Button>
            ),
            children: (
              <ProjectSubstantialCompletionDate
                completionDate={completionDate}
              />
            ),
          },
        }}
        onProcessRowUpdateError={(error) =>
          handleSnackbar(true, "Error updating table", "error", error)
        }
      />
      {editPhase && (
        <ProjectPhaseDialog
          phase={editPhase}
          onClose={() => setEditPhase(null)}
          onSubmitCallback={onSubmitCallback}
          phases={data?.moped_phases}
          noteTypes={data?.moped_note_types ?? []}
          currentProjectPhaseId={currentProjectPhaseId}
          currentPhaseTypeId={currentPhaseTypeId}
          projectId={projectId}
          handleSnackbar={handleSnackbar}
        />
      )}
      {isTemplateDialogOpen && (
        <PhaseTemplateModal
          isDialogOpen={isTemplateDialogOpen}
          handleDialogClose={() => setIsTemplateDialogOpen(false)}
          selectedPhases={data.moped_proj_phases}
          phaseNameLookup={phaseNameLookup}
          subphaseNameLookup={subphaseNameLookup}
          projectId={projectId}
          refetch={refetch}
          handleSnackbar={handleSnackbar}
        />
      )}
      <DeleteConfirmationModal
        type={"phase"}
        submitDelete={handleDeleteClick(deleteConfirmationId)}
        isDeleteConfirmationOpen={isDeleteConfirmationOpen}
        setIsDeleteConfirmationOpen={setIsDeleteConfirmationOpen}
      />
      <CurrentPhaseDeleteModal
        isOpen={isDeleteCurrentConfirmationOpen}
        setIsOpen={setIsDeleteCurrentConfirmationOpen}
      />
    </>
  );
};

export default ProjectPhases;
