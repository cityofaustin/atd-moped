import React, { useState, useMemo, useEffect } from "react";
import {
  Alert,
  Avatar,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
  FormControlLabel,
  Switch,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/EditOutlined";

import makeStyles from "@mui/styles/makeStyles";
import { getSessionDatabaseData } from "src/auth/user";
import { useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import parse from "html-react-parser";
import DOMPurify from "dompurify";

import NoteInput from "src/views/projects/projectView/ProjectNotes/NoteInput";
import NoteTypeButton from "src/views/projects/projectView/ProjectNotes/NoteTypeButton";
import DeleteConfirmationModal from "src/views/projects/projectView/DeleteConfirmationModal";
import ProjectStatusBadge from "src/views/projects/projectView/ProjectStatusBadge";

import * as yup from "yup";
import { yupValidator } from "src/utils/validation";

import "src/views/projects/projectView/ProjectNotes/ProjectNotes.css";

import {
  NOTES_QUERY,
  ADD_PROJECT_NOTE,
  UPDATE_PROJECT_NOTE,
  DELETE_PROJECT_NOTE,
} from "../../../queries/notes";
import { PROJECT_UPDATE_ECAPRIS_SYNC } from "src/queries/project";
import {
  makeHourAndMinutesFromTimeStampTZ,
  makeUSExpandedFormDateFromTimeStampTZ,
} from "src/utils/dateAndTime";
import { getUserFullName } from "src/utils/userNames";
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

// reshape the array of note types into an object with key slug, value id
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
  const hasECaprisId = !!projectData.moped_project[0].ecapris_subproject_id;
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
  const [shouldSyncFromECapris, setShouldSyncFromECapris] = useState(
    projectData.moped_project[0].should_sync_ecapris_statuses
  );

  // Keeps this state in sync with props
  useEffect(() => {
    setShouldSyncFromECapris(
      projectData.moped_project[0].should_sync_ecapris_statuses
    );
  }, [projectData.moped_project]);

  const isStatusUpdate =
    (!isEditingNote && newNoteType === noteTypesIDLookup["status_update"]) ||
    (isEditingNote && editingNoteType === noteTypesIDLookup["status_update"]);

  // if component is being used in edit modal from dashboard
  // get project id from props instead of url params
  const noteProjectId = isStatusEditModal ? projectId : projectIdFromParam;

  const { loading, error, data, refetch } = useQuery(NOTES_QUERY, {
    variables: {
      projectNoteConditions: {
        project_id: { _eq: Number(noteProjectId) },
        is_deleted: { _eq: false },
      },
    },
    fetchPolicy: "no-cache",
  });

  const mopedProjNotes = data?.moped_proj_notes;

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
    setEditingNoteType(item.project_note_type);
    setIsEditingNote(true);
    setNoteText(displayNotes[index].project_note);
    setEditingNoteId(item.project_note_id);
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

  const handleDeleteOpen = (id) => {
    setIsDeleteConfirmationOpen(true);
    setDeleteConfirmationId(id);
  };

  const handleECaprisSwitch = () => {
    updateShouldSyncECapris({
      variables: {
        projectId: noteProjectId,
        shouldSync: !shouldSyncFromECapris,
      },
    })
      .then(() => {
        handleSnackbar(true, "ECAPRIS sync status updated", "success");
      })
      .catch((error) =>
        handleSnackbar(
          true,
          "Error updating eCAPRIS sync status",
          "error",
          error
        )
      );
    setShouldSyncFromECapris(!shouldSyncFromECapris);
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
            <Grid item>
              <Tooltip
                placement="top"
                title={
                  hasECaprisId
                    ? "Statuses are synced from eCAPRIS every 30 minutes"
                    : "Add eCapris subproject ID to sync from eCAPRIS"
                }
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={shouldSyncFromECapris}
                      disabled={!hasECaprisId}
                      onChange={handleECaprisSwitch}
                    />
                  }
                  label="Sync from eCAPRIS"
                />
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
              <List className={classes.root}>
                <DeleteConfirmationModal
                  type="note"
                  submitDelete={() => submitDeleteNote(deleteConfirmationId)}
                  isDeleteConfirmationOpen={isDeleteConfirmationOpen}
                  setIsDeleteConfirmationOpen={setIsDeleteConfirmationOpen}
                >
                  {displayNotes.map((item, i) => {
                    const isNotLastItem = i < displayNotes.length - 1;
                    const phaseKey = item.moped_phase?.phase_key;
                    const phaseName = item.moped_phase?.phase_name;
                    /**
                     * Only allow the user who wrote the status to edit it
                     */
                    const editableNote =
                      userSessionData.user_id === item.created_by_user_id;
                    return (
                      <React.Fragment key={item.project_note_id}>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar />
                          </ListItemAvatar>
                          <ListItemText
                            className={editableNote ? classes.editableNote : ""}
                            secondaryTypographyProps={{
                              className: classes.editButtons,
                            }}
                            primary={
                              <>
                                <Typography
                                  component={"span"}
                                  className={classes.authorText}
                                >
                                  {getUserFullName(item.moped_user)}
                                </Typography>
                                <Typography
                                  component={"span"}
                                  className={classes.noteDate}
                                >
                                  {` - ${makeUSExpandedFormDateFromTimeStampTZ(
                                    item.created_at
                                  )} ${makeHourAndMinutesFromTimeStampTZ(
                                    item.created_at
                                  )}`}
                                </Typography>
                                <Typography
                                  component={"span"}
                                  className={classes.filterNoteType}
                                >
                                  {item.moped_note_type?.name}
                                </Typography>
                                <Typography component={"span"}>
                                  {/* only show note's status badge if the note has a phase_id */}
                                  {phaseKey && phaseName && (
                                    <ProjectStatusBadge
                                      phaseKey={phaseKey}
                                      phaseName={phaseName}
                                      condensed
                                      leftMargin
                                    />
                                  )}
                                </Typography>
                              </>
                            }
                            secondary={
                              editingNoteId === item.project_note_id ? (
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
                                  noteTypes={
                                    projectData?.moped_note_types ?? []
                                  }
                                  validator={isStatusUpdate ? validator : null}
                                />
                              ) : (
                                <Typography
                                  component={"span"}
                                  className={"noteBody"}
                                >
                                  {parse(item.project_note)}
                                </Typography>
                              )
                            }
                          />
                          {
                            // show edit/delete icons if note authored by logged in user
                            // or user is admin
                            editableNote && (
                              <ListItemSecondaryAction
                                className={classes.editControls}
                              >
                                {editingNoteId !== item.project_note_id && (
                                  <IconButton
                                    edge="end"
                                    aria-label="edit"
                                    onClick={() => editNote(i, item)}
                                    size="large"
                                  >
                                    <EditIcon className={classes.editButtons} />
                                  </IconButton>
                                )}
                                {!isEditingNote && (
                                  <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() =>
                                      handleDeleteOpen(item.project_note_id)
                                    }
                                    size="large"
                                  >
                                    <DeleteIcon
                                      className={classes.editButtons}
                                    />
                                  </IconButton>
                                )}
                              </ListItemSecondaryAction>
                            )
                          }
                        </ListItem>
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
