import React, { useState, useMemo } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  List,
  Typography,
  FormControlLabel,
  Switch,
  Tooltip,
  FormHelperText,
} from "@mui/material";

import { useSessionDatabaseData } from "src/auth/user";
import { useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import parse from "html-react-parser";
import DOMPurify from "dompurify";

import NoteInput from "src/views/projects/projectView/ProjectNotes/NoteInput";
import NoteTypeButton from "src/views/projects/projectView/ProjectNotes/NoteTypeButton";
import DeleteConfirmationModal from "src/views/projects/projectView/DeleteConfirmationModal";
import ProjectNote from "src/views/projects/projectView/ProjectNotes/ProjectNote";

import * as yup from "yup";
import { yupValidator } from "src/utils/validation";

import "src/views/projects/projectView/ProjectNotes/ProjectNotes.css";

import {
  COMBINED_NOTES_QUERY,
  ADD_PROJECT_NOTE,
  UPDATE_PROJECT_NOTE,
  DELETE_PROJECT_NOTE,
} from "src/queries/notes";
import { PROJECT_UPDATE_ECAPRIS_SYNC } from "src/queries/project";
import { agolValidation } from "src/constants/projects";

/* Validation for note input (create or edit) */
const validationSchema = yup.object().shape({
  projectStatusUpdate: agolValidation.projectStatusUpdate,
});
const validator = (value) => yupValidator(value, validationSchema);

/**
 * Hook to create an object mapping note type slugs to their IDs
 * @param {Array} noteTypes - Array of note types from moped_note_types query
 * @returns
 */
export const useNoteTypeObject = (noteTypes) =>
  useMemo(
    () =>
      noteTypes.reduce(
        (obj, item) =>
          Object.assign(obj, {
            [item.slug]: item.id,
          }),
        {}
      ),
    [noteTypes]
  );

/**
 * Hook to filter notes based on the selected note type and if eCAPRIS status syncing is enabled
 * @param {Array} notes - Array of notes to filter
 * @param {Number} filterNoteType - The ID of the note type to filter by
 * @param {Boolean} shouldSyncEcaprisStatuses - Whether to sync eCAPRIS statuses / show eCAPRIS statuses
 * @param {Boolean} isStatusEditModal - we only show status updates in the ProjectSummaryStatusUpdate modal
 * @returns
 */
const useFilterNotes = (
  notes,
  filterNoteType,
  shouldSyncEcaprisStatuses,
  isStatusEditModal
) =>
  useMemo(() => {
    let displayNotes = notes ? [...notes] : [];

    /* If eCAPRIS status syncing is not enabled, filter out eCAPRIS status updates */
    if (!shouldSyncEcaprisStatuses) {
      displayNotes = displayNotes.filter(
        (note) => note.note_type_slug !== "ecapris_status_update"
      );
    }

    /* If the component is being used in the status edit modal, only show status updates
     * Otherwise, show all notes or filter by note type if specified
     */
    if (isStatusEditModal) {
      return displayNotes.filter((note) => note.is_status_update);
    } else {
      if (!filterNoteType) {
        return displayNotes;
      } else {
        return displayNotes.filter((n) => n.note_type_id === filterNoteType);
      }
    }
  }, [notes, filterNoteType, shouldSyncEcaprisStatuses, isStatusEditModal]);

/**
 * ProjectNotes component that is rendered in the ProjectView and ProjectSummaryStatusUpdate
 * @param {boolean} isStatusEditModal - true if the component is being used in the ProjectSummaryStatusUpdate modal
 * @param {string} currentPhaseId - The phase ID of the current phase
 * @param {object} projectData - The project data passed from ProjectView
 * @param {function} handleSnackbar - Function to handle snackbar notifications
 * @param {function} closeModalDialog - Function to close the modal dialog
 * @param {function} refetchProjectSummary - Function to refetch the project summary data
 * @param {string} projectId - The project ID if rendered in the ProjectSummaryStatusUpdate modal
 * @param {string} eCaprisSubprojectId - The eCAPRIS subproject ID if present
 * @returns JSX.Element
 */
const ProjectNotes = ({
  modal: isStatusEditModal,
  currentPhaseId,
  data: projectData,
  handleSnackbar,
  closeModalDialog,
  refetch: refetchProjectSummary,
  projectId,
  eCaprisSubprojectId = null,
}) => {
  /* User details for create and update mutations */
  const userSessionData = useSessionDatabaseData();

  /** Get projectId from URL params if not passed down from ProjectSummaryStatusUpdate component
   * If component is being used in edit modal from dashboard get project id from props instead of url params.
   */
  let { projectId: projectIdFromParam } = useParams();
  const noteProjectId = isStatusEditModal ? projectId : projectIdFromParam;

  /* Use currentPhaseId if passed down from ProjectSummaryStatusUpdate component,
  otherwise use data passed from ProjectView */
  const noteCurrentPhaseId = isStatusEditModal
    ? currentPhaseId
    : projectData?.moped_project[0]?.moped_proj_phases[0]?.moped_phase.phase_id;
  const noteTypesIDLookup = useNoteTypeObject(
    projectData?.moped_note_types || []
  );
  const [noteText, setNoteText] = useState("");

  /* New note */
  const [newNoteType, setNewNoteType] = useState(
    isStatusEditModal
      ? noteTypesIDLookup["status_update"]
      : noteTypesIDLookup["internal_note"]
  );
  const [noteAddLoading, setNoteAddLoading] = useState(false);
  const [noteAddSuccess, setNoteAddSuccess] = useState(false);

  /* Edit existing note */
  const [editingNoteType, setEditingNoteType] = useState(null);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);

  const [filterNoteType, setFilterNoteType] = useState(null);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);

  const isStatusUpdate =
    (!isEditingNote && newNoteType === noteTypesIDLookup["status_update"]) ||
    (isEditingNote && editingNoteType === noteTypesIDLookup["status_update"]);

  /* Query Moped and eCAPRIS notes with matching filters */
  const queryVariables = eCaprisSubprojectId
    ? {
        projectNoteConditions: {
          _or: [
            { ecapris_subproject_id: { _eq: eCaprisSubprojectId } },
            { project_id: { _eq: Number(noteProjectId) } },
          ],
        },
      }
    : {
        projectNoteConditions: {
          project_id: { _eq: Number(noteProjectId) },
        },
      };

  const { loading, error, data, refetch } = useQuery(COMBINED_NOTES_QUERY, {
    variables: { ...queryVariables, order_by: { created_at: "desc" } },
    fetchPolicy: "no-cache",
  });

  const hasECaprisId = !!projectData.moped_project[0].ecapris_subproject_id;
  const shouldSyncFromECAPRIS =
    projectData.moped_project[0].should_sync_ecapris_statuses;

  const combinedNotes = data?.combined_project_notes_view || [];
  const displayNotes = useFilterNotes(
    combinedNotes,
    filterNoteType,
    shouldSyncFromECAPRIS,
    isStatusEditModal
  );

  /* Add, edit, and delete mutations */
  const [addNewNote] = useMutation(ADD_PROJECT_NOTE, {
    onCompleted() {
      setNoteText("");
      refetch();
      setNoteAddSuccess(true);
      setTimeout(() => {
        setNoteAddLoading(false);
        setNoteAddSuccess(false);
        if (isStatusEditModal) {
          closeModalDialog();
        }
      }, 350);
    },
  });

  const [editExistingNote] = useMutation(UPDATE_PROJECT_NOTE, {
    onCompleted() {
      setNoteText("");
      refetch();
      if (isStatusEditModal) {
        closeModalDialog();
      } else {
        // refetch the project summary query passed down from ProjectView
        refetchProjectSummary();
      }
      setNoteAddSuccess(true);
      setIsEditingNote(false);
      setTimeout(() => {
        setNoteAddLoading(false);
        setNoteAddSuccess(false);
      }, 350);
    },
  });

  const [deleteExistingNote] = useMutation(DELETE_PROJECT_NOTE, {
    onCompleted() {
      refetch();
      if (isStatusEditModal) {
        closeModalDialog();
      } else {
        // refetch the project summary query passed down from ProjectView
        refetchProjectSummary();
      }
    },
  });

  const [updateShouldSyncECapris] = useMutation(PROJECT_UPDATE_ECAPRIS_SYNC);

  /* Handlers */
  const submitNewNote = () => {
    setNoteAddLoading(true);
    addNewNote({
      variables: {
        objects: [
          {
            project_note: DOMPurify.sanitize(noteText),
            project_id: Number(noteProjectId),
            project_note_type: newNoteType,
            phase_id: noteCurrentPhaseId,
          },
        ],
      },
    })
      .then(() => {
        handleSnackbar(true, "Note/status added", "success");
      })
      .catch((error) =>
        handleSnackbar(true, "Error adding note/status", "error", error)
      );
  };

  const editNote = (index, item) => {
    setEditingNoteType(item.note_type_id);
    setIsEditingNote(true);
    setNoteText(displayNotes[index].project_note);
    setEditingNoteId(item.original_id);
  };

  const cancelNoteEdit = () => {
    setEditingNoteType(null);
    setNoteText("");
    setIsEditingNote(false);
    setEditingNoteId(null);
  };

  const submitEditNote = () => {
    setNoteAddLoading(true);
    setEditingNoteId(null);
    editExistingNote({
      variables: {
        projectNote: DOMPurify.sanitize(noteText),
        projectId: Number(noteProjectId),
        projectNoteId: editingNoteId,
        projectNoteType: editingNoteType,
      },
    })
      .then(() => {
        handleSnackbar(true, "Note/status updated", "success");
      })
      .catch((error) =>
        handleSnackbar(true, "Error updating note/status", "error", error)
      );
    setEditingNoteType(null);
  };

  const submitDeleteNote = (project_note_id) => {
    deleteExistingNote({
      variables: {
        projectId: noteProjectId,
        projectNoteId: project_note_id,
      },
    })
      .then(() => {
        setIsDeleteConfirmationOpen(false);
        handleSnackbar(true, "Note/status deleted", "success");
      })
      .catch((error) =>
        handleSnackbar(true, "Error deleting note/status", "error", error)
      );
  };

  const handleDeleteOpen = (id) => {
    setIsDeleteConfirmationOpen(true);
    setDeleteConfirmationId(id);
  };

  const handleECaprisSwitch = () => {
    updateShouldSyncECapris({
      variables: {
        projectId: noteProjectId,
        shouldSync: !shouldSyncFromECAPRIS,
      },
    })
      .then(() => {
        handleSnackbar(true, "eCAPRIS sync status updated", "success");
      })
      .catch((error) =>
        handleSnackbar(
          true,
          "Error updating eCAPRIS sync status",
          "error",
          error
        )
      );
    refetchProjectSummary();
  };

  if (error) {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Alert severity="error">
            Something went wrong. Refresh the page to try again.
          </Alert>
        </Grid>
      </Grid>
    );
  }

  return (
    <CardContent>
      <Grid container spacing={2}>
        {/*New Note Form*/}
        {!isEditingNote && (
          <Grid item xs={12}>
            <Card>
              <NoteInput
                noteText={noteText}
                setNoteText={setNoteText}
                newNoteType={newNoteType}
                setNewNoteType={setNewNoteType}
                isEditingNote={isEditingNote}
                noteAddLoading={noteAddLoading}
                noteAddSuccess={noteAddSuccess}
                submitNewNote={submitNewNote}
                submitEditNote={submitEditNote}
                cancelNoteEdit={cancelNoteEdit}
                isStatusEditModal={isStatusEditModal}
                noteTypes={projectData?.moped_note_types ?? []}
                validator={isStatusUpdate ? validator : null}
              />
            </Card>
          </Grid>
        )}
        {/* Visible note types can only be filtered on the Notes Tab.
          The status edit modal only shows statuses, and does not show internal notes */}
        {!isStatusEditModal && (
          <Grid
            container
            item
            xs={12}
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item>
              <FormControlLabel
                sx={{ margin: 2 }}
                label="Show"
                control={<span />}
              />
              <NoteTypeButton
                filterNoteType={filterNoteType}
                setFilterNoteType={setFilterNoteType}
                noteTypeId={null}
                label="All"
              />
              {projectData?.moped_note_types.map((type) => (
                <NoteTypeButton
                  filterNoteType={filterNoteType}
                  setFilterNoteType={setFilterNoteType}
                  noteTypeId={type.id}
                  label={type.name}
                  key={type.slug}
                  isDisabled={
                    type.slug === "ecapris_status_update" &&
                    (!hasECaprisId || !shouldSyncFromECAPRIS)
                  }
                  disabledMessage="Enable eCAPRIS syncing to filter to eCAPRIS statuses"
                />
              ))}
            </Grid>
            <Grid item>
              <Tooltip
                placement="top"
                title={
                  !hasECaprisId
                    ? "Add eCAPRIS subproject ID to enable syncing"
                    : null
                }
              >
                <Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={shouldSyncFromECAPRIS}
                        disabled={!hasECaprisId}
                        onChange={handleECaprisSwitch}
                      />
                    }
                    label="Sync from eCAPRIS"
                  />
                  {hasECaprisId ? (
                    <FormHelperText>
                      Statuses are synced every 30 minutes
                    </FormHelperText>
                  ) : null}
                </Box>
              </Tooltip>
            </Grid>
          </Grid>
        )}
        {/*Now the notes*/}
        <Grid item xs={12}>
          <Card>
            {loading || !displayNotes ? (
              <CircularProgress />
            ) : displayNotes.length > 0 ? (
              <List
                sx={{
                  width: "100%",
                }}
              >
                <DeleteConfirmationModal
                  type="note"
                  submitDelete={() => submitDeleteNote(deleteConfirmationId)}
                  isDeleteConfirmationOpen={isDeleteConfirmationOpen}
                  setIsDeleteConfirmationOpen={setIsDeleteConfirmationOpen}
                >
                  {displayNotes.map((note, i) => {
                    const isNotLastItem = i < displayNotes.length - 1;

                    /**
                     * Only allow the user who wrote the status to edit it - if it is editable
                     */
                    const isNoteEditable =
                      userSessionData.user_id === note.created_by_user_id &&
                      note.is_editable;
                    const isEditingNote = editingNoteId === note.original_id;
                    return (
                      <React.Fragment key={note.id}>
                        <ProjectNote
                          note={note}
                          noteIndex={i}
                          isNoteEditable={isNoteEditable}
                          isEditingNote={isEditingNote}
                          handleDeleteOpen={handleDeleteOpen}
                          handleEditClick={editNote}
                          secondary={
                            isEditingNote ? (
                              <NoteInput
                                noteText={noteText}
                                setNoteText={setNoteText}
                                isEditingNote={isEditingNote}
                                noteAddLoading={noteAddLoading}
                                noteAddSuccess={noteAddSuccess}
                                submitNewNote={submitNewNote}
                                submitEditNote={submitEditNote}
                                cancelNoteEdit={cancelNoteEdit}
                                editingNoteType={editingNoteType}
                                setEditingNoteType={setEditingNoteType}
                                isStatusEditModal={isStatusEditModal}
                                noteTypes={projectData?.moped_note_types ?? []}
                                validator={isStatusUpdate ? validator : null}
                              />
                            ) : (
                              <Typography component={"span"}>
                                {parse(note.project_note)}
                              </Typography>
                            )
                          }
                        />
                        {isNotLastItem && <Divider component="li" />}
                      </React.Fragment>
                    );
                  })}
                </DeleteConfirmationModal>
              </List>
            ) : (
              <Typography
                sx={{
                  margin: 3,
                }}
              >
                No notes to display
              </Typography>
            )}
          </Card>
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default ProjectNotes;
