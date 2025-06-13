import React, { useState, useMemo } from "react";
import {
  Alert,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  List,
  Typography,
  FormControlLabel,
} from "@mui/material";

import { getSessionDatabaseData } from "src/auth/user";
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
 * Hook to filter notes based on the selected note type
 * @param {Array} notes - Array of notes to filter
 * @param {Number} filterNoteType - The ID of the note type to filter by
 * @param {Object} noteTypesIDLookup - Object mapping note type slugs to their IDs
 * @returns
 */
const useFilterNotes = (notes, filterNoteType, noteTypesIDLookup) =>
  useMemo(() => {
    if (!filterNoteType) {
      // show all the notes
      return notes;
    } else {
      // Check to see if array exists before trying to filter
      const filteredNotes = notes
        ? notes.filter(
            (n) => noteTypesIDLookup[n.note_type_slug] === filterNoteType
          )
        : [];
      return filteredNotes;
    }
  }, [notes, filterNoteType, noteTypesIDLookup]);

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
  const userSessionData = getSessionDatabaseData();

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

  const [filterNoteType, setFilterNoteType] = useState(
    isStatusEditModal ? noteTypesIDLookup["status_update"] : null
  );
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
          _and: { is_deleted: { _eq: false } },
        },
      }
    : {
        projectNoteConditions: {
          project_id: { _eq: Number(noteProjectId) },
          is_deleted: { _eq: false },
        },
      };

  const { loading, error, data, refetch } = useQuery(COMBINED_NOTES_QUERY, {
    variables: { ...queryVariables, order_by: { created_at: "desc" } },
    fetchPolicy: "no-cache",
  });

  const combinedNotes = data?.combined_project_notes || [];
  const displayNotes = useFilterNotes(
    combinedNotes,
    filterNoteType,
    noteTypesIDLookup
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
    setEditingNoteType(noteTypesIDLookup[item.note_type_slug]);
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
          <Grid item xs={12}>
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
              />
            ))}
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
