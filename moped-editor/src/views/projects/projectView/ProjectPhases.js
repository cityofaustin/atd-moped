import { useCallback, useMemo, useState } from "react";
import { useMutation } from "@apollo/client";
import { CircularProgress, Box, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { grey, green } from "@mui/material/colors";
import {
  EditOutlined as EditOutlinedIcon,
  DeleteOutline as DeleteOutlineIcon,
  CheckCircleOutline,
  HelpOutline,
} from "@mui/icons-material";
import ProjectPhaseToolbar from "./ProjectPhaseToolbar";
import PhaseTemplateModal from "./PhaseTemplateModal";
import ProjectPhaseDialog from "./ProjectPhaseDialog";
import { DELETE_PROJECT_PHASE } from "src/queries/project";

/**
 * Get the project_phase_ids of the project's current phase. Although only
 * one phase should ever be current, we handle the possibilty that there
 * are multiple current phases
 * @param {Array} projphases - array of this project's moped_proj_phases
 * @return {Array} of IDs of current project phases
 */
const useCurrentProjectPhaseIDs = (projectPhases) =>
  useMemo(
    () =>
      projectPhases
        ? projectPhases
            .filter(({ is_current_phase }) => is_current_phase)
            .map(({ project_phase_id }) => project_phase_id)
        : [],
    [projectPhases]
  );

const usePhaseNameLookup = (phases) =>
  useMemo(
    () =>
      phases.reduce(
        (obj, item) =>
          Object.assign(obj, {
            [item.phase_id]: item.phase_name,
          }),
        {}
      ),
    [phases]
  );

const useSubphaseNameLookup = (subphases) =>
  useMemo(
    () =>
      subphases.reduce(
        (obj, item) =>
          Object.assign(obj, {
            [item.subphase_id]: item.subphase_name,
          }),
        {}
      ),
    [subphases]
  );

/** Hook that provides memoized column settings */
const useColumns = ({ deleteInProgress, onDeletePhase, setEditPhase }) =>
  useMemo(() => {
    return [
      {
        headerName: "Phase",
        field: "moped_phase",
        minWidth: 200,
        valueGetter: ({ row }) => row.moped_phase?.phase_name,
      },
      {
        headerName: "Subphase",
        field: "moped_subphase",
        minWidth: 200,
        valueGetter: ({ row }) => row.moped_subphase?.subphase_name,
      },
      {
        headerName: "Start",
        field: "phase_start",
        type: "date",
        /** valueGetter is used by the date sort function inherently used by the `date` type column */
        valueGetter: ({ row }) =>
          row.phase_start ? new Date(row.phase_start) : null,
        /**  the renderCell function controls the react node rendered for this cell */
        renderCell: ({ row }) => {
          const strToRender = row.phase_start
            ? new Date(row.phase_start).toLocaleDateString()
            : "";
          return (
            <Box display="flex">
              <span style={{ paddingInlineEnd: ".25rem" }}>{strToRender}</span>
              {!row.is_phase_start_confirmed && (
                <HelpOutline style={{ color: grey[500] }} />
              )}
            </Box>
          );
        },
        minWidth: 150,
      },
      {
        headerName: "End",
        field: "phase_end",
        type: "date",
        /** valueGetter is used by the date sort function inherently used by the `date` type column */
        valueGetter: ({ row }) =>
          row.phase_end ? new Date(row.phase_end) : null,
        /**  the renderCell function controls the react node rendered for this cell */
        renderCell: ({ row }) => {
          const strToRender = row.phase_end
            ? new Date(row.phase_end).toLocaleDateString()
            : "";
          return (
            <Box display="flex">
              <span style={{ paddingInlineEnd: ".25rem" }}>{strToRender}</span>
              {!row.is_phase_end_confirmed && (
                <HelpOutline style={{ color: grey[500] }} />
              )}
            </Box>
          );
        },
        minWidth: 150,
      },
      {
        headerName: "Description",
        field: "phase_description",
        minWidth: 300,
      },
      {
        headerName: "Current",
        field: "is_current_phase",
        minWidth: 150,
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
        hideable: false,
        filterable: false,
        sortable: false,
        renderCell: ({ row }) => {
          return deleteInProgress ? (
            <CircularProgress color="primary" size={20} />
          ) : (
            <div>
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
                  onDeletePhase({ project_phase_id: row.project_phase_id })
                }
              >
                <DeleteOutlineIcon />
              </IconButton>
            </div>
          );
        },
      },
    ];
  }, [deleteInProgress, onDeletePhase, setEditPhase]);

/**
 * ProjectPhases Component - renders Project Phase table
 * @return {JSX.Element}
 * @constructor
 */
const ProjectPhases = ({ projectId, loading, data, refetch }) => {
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [editPhase, setEditPhase] = useState(null);

  const [deletePhase, { loading: deleteInProgress }] =
    useMutation(DELETE_PROJECT_PHASE);

  const onClickAddPhase = () => setEditPhase({ project_id: projectId });

  const onDeletePhase = useCallback(
    ({ project_phase_id }) => {
      window.confirm("Are you sure you want to delete this phase?") &&
        deletePhase({
          variables: { project_phase_id },
          refetchQueries: ["ProjectSummary"],
        }).then(() => {
          refetch();
        });
    },
    [deletePhase, refetch]
  );

  const columns = useColumns({
    setEditPhase,
    deleteInProgress: false,
    onDeletePhase,
  });

  const currentProjectPhaseIds = useCurrentProjectPhaseIDs(
    data?.moped_proj_phases
  );

  const phaseNameLookup = usePhaseNameLookup(data?.moped_phases || []);

  const subphaseNameLookup = useSubphaseNameLookup(data?.moped_subphases || []);

  const onSubmitCallback = () => {
    refetch().then(() => setEditPhase(null));
  };

  return (
    <>
      <DataGrid
        autoHeight
        columns={columns}
        density="comfortable"
        getRowId={(row) => row.project_phase_id}
        disableRowSelectionOnClick
        getRowHeight={() => "auto"}
        hideFooterPagination={true}
        localeText={{ noRowsLabel: "No phases" }}
        rows={data?.moped_proj_phases || []}
        slots={{
          toolbar: ProjectPhaseToolbar,
        }}
        slotProps={{
          toolbar: {
            addAction: onClickAddPhase,
            setIsDialogOpen: setIsTemplateDialogOpen,
          },
        }}
      />
      {editPhase && (
        <ProjectPhaseDialog
          phase={editPhase}
          onClose={() => setEditPhase(null)}
          onSubmitCallback={onSubmitCallback}
          phases={data?.moped_phases}
          currentProjectPhaseIds={currentProjectPhaseIds}
          projectId={projectId}
        />
      )}
      <PhaseTemplateModal
        isDialogOpen={isTemplateDialogOpen}
        handleDialogClose={() => setIsTemplateDialogOpen(false)}
        selectedPhases={data.moped_proj_phases}
        phaseNameLookup={phaseNameLookup}
        subphaseNameLookup={subphaseNameLookup}
        projectId={projectId}
        refetch={refetch}
      />
    </>
  );
};

export default ProjectPhases;
