import React, { useEffect, useState } from "react";
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
  Button,
  FormControlLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/EditOutlined";

import makeStyles from "@mui/styles/makeStyles";
import { getSessionDatabaseData } from "src/auth/user";
import { useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import parse from "html-react-parser";
import DOMPurify from "dompurify";
import NoteInput from "./NoteInput";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import ProjectStatusBadge from "./ProjectStatusBadge";

import "./ProjectNotes.css";

// Query
import {
  NOTES_QUERY,
  ADD_PROJECT_NOTE,
  UPDATE_PROJECT_NOTE,
  DELETE_PROJECT_NOTE,
} from "../../../queries/notes";
import {
  makeHourAndMinutesFromTimeStampTZ,
  makeUSExpandedFormDateFromTimeStampTZ,
} from "src/utils/dateAndTime";
import { getUserFullName } from "src/utils/userNames";

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
  chip: {
    margin: theme.spacing(0.5),
  },
}));

// Lookup array to convert project note types to a human readable interpretation
// The zeroth item in the list is intentionally blank; the notes are 1-indexed.
const projectNoteTypes = ["", "Internal Note", "Status Update"];

export const STATUS_UPDATE_TYPE_ID = 2;
export const INTERNAL_NOTE_TYPE_ID = 1;

const ProjectNotes = (props) => {
  const isStatusEditModal = props.modal;
  // use currentPhaseId if passed down from ProjectSummaryStatusUpdate component,
  // otherwise use data passed from ProjectView
  const currentPhaseId =
    props.currentPhaseId ??
    props.data?.moped_project[0]?.moped_proj_phases[0]?.moped_phase.phase_id;
  const handleSnackbar = props.handleSnackbar;
  let { projectId } = useParams();
  const classes = useStyles();
  const userSessionData = getSessionDatabaseData();
  const [noteText, setNoteText] = useState("");
  const [newNoteType, setNewNoteType] = useState(
    isStatusEditModal ? STATUS_UPDATE_TYPE_ID : INTERNAL_NOTE_TYPE_ID
  );
  const [editingNoteType, setEditingNoteType] = useState(null);
  const [noteAddLoading, setNoteAddLoading] = useState(false);
  const [noteAddSuccess, setNoteAddSuccess] = useState(false);
  const [editingNote, setEditingNote] = useState(false);
  const [noteId, setNoteId] = useState(null);
  const [displayNotes, setDisplayNotes] = useState([]);
  const [filterNoteType, setFilterNoteType] = useState(
    isStatusEditModal ? STATUS_UPDATE_TYPE_ID : 0
  );
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);

  // if component is being used in edit modal from dashboard
  // get project id from props instead of url params
  if (isStatusEditModal) {
    projectId = props.projectId;
  }

  const { loading, error, data, refetch } = useQuery(NOTES_QUERY, {
    variables: {
      projectNoteConditions: {
        project_id: { _eq: Number(projectId) },
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
          props.closeModalDialog();
        }
      }, 350);
    },
  });

  const [editExistingNote] = useMutation(UPDATE_PROJECT_NOTE, {
    onCompleted() {
      setNoteText("");
      refetch();
      if (isStatusEditModal) {
        props.closeModalDialog();
      } else {
        // refetch the project summary query passed down from ProjectView
        props.refetch();
      }
      setNoteAddSuccess(true);
      setEditingNote(false);
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
        props.closeModalDialog();
      } else {
        // refetch the project summary query passed down from ProjectView
        props.refetch();
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
            project_id: projectId,
            project_note_type: newNoteType,
            phase_id: currentPhaseId,
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
    setEditingNote(true);
    setNoteText(displayNotes[index].project_note);
    setNoteId(item.project_note_id);
  };

  const cancelNoteEdit = () => {
    setEditingNoteType(null);
    setNoteText("");
    setEditingNote(false);
    setNoteId(null);
  };

  const submitEditNote = () => {
    setNoteAddLoading(true);
    setNoteId(null);
    editExistingNote({
      variables: {
        projectNote: DOMPurify.sanitize(noteText),
        projectId: Number(projectId),
        projectNoteId: noteId,
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
        projectId: Number(projectId),
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

  /**
   * Updates the note type based on conditions
   * @param {Number} typeId
   */
  const changeFilterNoteType = (typeId) => setFilterNoteType(Number(typeId));

  // when the data changes, update the display notes state
  useEffect(() => {
    if (!loading && data) {
      setDisplayNotes(data.moped_proj_notes);
    }
    if (error) {
      handleSnackbar(true, "Error loading notes", "error", error);
    }
  }, [loading, data, error, handleSnackbar]);

  /**
   * Whenever filterNoteType changes, filter the notes being displayed
   */
  useEffect(() => {
    if (filterNoteType === 0) {
      // show all the notes
      setDisplayNotes(mopedProjNotes);
    } else {
      // on first few renders, mopedProjNotes is still undefined.
      // Check to see if array exists before trying to filter
      const filteredNotes = mopedProjNotes
        ? mopedProjNotes.filter((n) => n.project_note_type === filterNoteType)
        : [];
      setDisplayNotes(filteredNotes);
    }
  }, [filterNoteType, mopedProjNotes]);

  /**
   * Defines the NoteTypeButton with a toggle style-change behavior.
   * @param {Object} props
   * @return {JSX.Element}
   * @constructor
   */
  const NoteTypeButton = (props) => (
    <Button
      color="primary"
      className={classes.showButtonItem}
      variant={filterNoteType === props.noteTypeId ? "contained" : "outlined"}
      onClick={() => changeFilterNoteType(props.noteTypeId)}
    >
      {props.children}
    </Button>
  );

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
        {!editingNote && (
          <Grid item xs={12}>
            <Card>
              <NoteInput
                noteText={noteText}
                setNoteText={setNoteText}
                newNoteType={newNoteType}
                setNewNoteType={setNewNoteType}
                editingNote={editingNote}
                noteAddLoading={noteAddLoading}
                noteAddSuccess={noteAddSuccess}
                submitNewNote={submitNewNote}
                submitEditNote={submitEditNote}
                cancelNoteEdit={cancelNoteEdit}
                isStatusEditModal={isStatusEditModal}
              />
            </Card>
          </Grid>
        )}
        {/*First the Filter Buttons*/}
        {!isStatusEditModal && (
          <Grid item xs={12}>
            <FormControlLabel
              className={classes.showButtonItem}
              label="Show"
              control={<span />}
            />
            <NoteTypeButton noteTypeId={0}>All</NoteTypeButton>
            <NoteTypeButton noteTypeId={INTERNAL_NOTE_TYPE_ID}>
              Internal Notes
            </NoteTypeButton>
            <NoteTypeButton noteTypeId={STATUS_UPDATE_TYPE_ID}>
              Status Updates
            </NoteTypeButton>
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
                                  {` ${
                                    projectNoteTypes[item.project_note_type]
                                  }`}
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
                              noteId === item.project_note_id ? (
                                <NoteInput
                                  noteText={noteText}
                                  setNoteText={setNoteText}
                                  editingNote={editingNote}
                                  noteAddLoading={noteAddLoading}
                                  noteAddSuccess={noteAddSuccess}
                                  submitNewNote={submitNewNote}
                                  submitEditNote={submitEditNote}
                                  cancelNoteEdit={cancelNoteEdit}
                                  editingNoteType={editingNoteType}
                                  setEditingNoteType={setEditingNoteType}
                                  isStatusEditModal={isStatusEditModal}
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
                                {noteId !== item.project_note_id && (
                                  <IconButton
                                    edge="end"
                                    aria-label="edit"
                                    onClick={() => editNote(i, item)}
                                    size="large"
                                  >
                                    <EditIcon className={classes.editButtons} />
                                  </IconButton>
                                )}
                                {!editingNote && (
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
