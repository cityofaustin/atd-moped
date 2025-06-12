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

import makeStyles from "@mui/styles/makeStyles";
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
} from "../../../queries/notes";
import { agolValidation } from "src/constants/projects";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  authorText: {
    display: "inline",
    fontWeight: 500,
  },
  noteDate: {
    display: "inline",
    fontSize: ".875rem",
  },
  editableNote: {
    marginRight: "30px",
  },
  filterNoteType: {
    display: "inline",
    marginLeft: "12px",
    color: theme.palette.primary.main,
    textTransform: "uppercase",
    fontSize: ".875rem",
    fontWeight: 500,
  },
  emptyState: {
    margin: theme.spacing(3),
  },
  showButtonItem: {
    margin: theme.spacing(2),
  },
  editControls: {
    top: "0%",
    marginTop: "25px",
  },
  editButtons: {
    color: theme.palette.text.primary,
  },
}));

const validationSchema = yup.object().shape({
  projectStatusUpdate: agolValidation.projectStatusUpdate,
});
const validator = (value) => yupValidator(value, validationSchema);

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

const useFilterNotes = (notes, filterNoteType) =>
  useMemo(() => {
    if (!filterNoteType) {
      // show all the notes
      return notes;
    } else {
      // Check to see if array exists before trying to filter
      const filteredNotes = notes
        ? notes.filter((n) => n.project_note_type === filterNoteType)
        : [];
      return filteredNotes;
    }
  }, [notes, filterNoteType]);

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
  // use currentPhaseId if passed down from ProjectSummaryStatusUpdate component,
  // otherwise use data passed from ProjectView
  const noteCurrentPhaseId = isStatusEditModal
    ? currentPhaseId
    : projectData?.moped_project[0]?.moped_proj_phases[0]?.moped_phase.phase_id;
  let { projectId: projectIdFromParam } = useParams();
  const classes = useStyles();
  const userSessionData = getSessionDatabaseData();
  const noteTypesIDLookup = useNoteTypeObject(
    projectData?.moped_note_types || []
  );
  const [noteText, setNoteText] = useState("");
  const [newNoteType, setNewNoteType] = useState(
    isStatusEditModal
      ? noteTypesIDLookup["status_update"]
      : noteTypesIDLookup["internal_note"]
  );
  const [editingNoteType, setEditingNoteType] = useState(null);
  const [noteAddLoading, setNoteAddLoading] = useState(false);
  const [noteAddSuccess, setNoteAddSuccess] = useState(false);
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

  // if component is being used in edit modal from dashboard
  // get project id from props instead of url params
  const noteProjectId = isStatusEditModal ? projectId : projectIdFromParam;

  const queryVariables = eCaprisSubprojectId
    ? {
        projectNoteConditions: {
          _or: [
            { ecapris_subproject_id: { _eq: eCaprisSubprojectId } },
            { project_id: { _eq: Number(noteProjectId) } },
          ],
          _and: { is_deleted: { _eq: false } },
        },
        order_by: { created_at: "desc" },
      }
    : {
        projectNoteConditions: {
          project_id: { _eq: Number(noteProjectId) },
          is_deleted: { _eq: false },
        },
        order_by: { created_at: "desc" },
      };

  const { loading, error, data, refetch } = useQuery(COMBINED_NOTES_QUERY, {
    variables: queryVariables,
    fetchPolicy: "no-cache",
  });

  const mopedProjNotes = data?.combined_project_notes || [];

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

  const displayNotes = useFilterNotes(mopedProjNotes, filterNoteType);
  console.log("displayNotes", displayNotes);

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
              className={classes.showButtonItem}
              label="Show"
              control={<span />}
            />
            <NoteTypeButton
              showButtonItemStyle={classes.showButtonItem}
              filterNoteType={filterNoteType}
              setFilterNoteType={setFilterNoteType}
              noteTypeId={null}
              label="All"
            />
            {projectData?.moped_note_types.map((type) => (
              <NoteTypeButton
                showButtonItemStyle={classes.showButtonItem}
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
              <List className={classes.root}>
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
                      userSessionData.user_id === note.created_by_user_id ||
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
                              <Typography
                                component={"span"}
                                className={"noteBody"}
                              >
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
              <Typography className={classes.emptyState}>
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
