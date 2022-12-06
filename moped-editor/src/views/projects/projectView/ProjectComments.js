import React, { useEffect, useState } from "react";
import {
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
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/DeleteOutlined";
import EditIcon from "@material-ui/icons/EditOutlined";

import { makeStyles } from "@material-ui/core/styles";
import { getSessionDatabaseData } from "src/auth/user";
import { useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import parse from "html-react-parser";
import DOMPurify from "dompurify";
import CommentInputQuill from "./CommentInputQuill";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

import "./ProjectComments.css";

// Query
import {
  COMMENTS_QUERY,
  ADD_PROJECT_COMMENT,
  UPDATE_PROJECT_COMMENT,
  DELETE_PROJECT_COMMENT,
} from "../../../queries/comments";
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
  commentorText: {
    display: "inline",
    fontWeight: 500,
  },
  commentDate: {
    display: "inline",
    fontSize: ".875rem",
  },
  editableComment: {
    marginRight: "30px",
  },
  noteType: {
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
  editDeleteButtons: {
    color: "#000000",
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

// Lookup array to convert project note types to a human readable interpretation
// The zeroth item in the list is intentionally blank; the notes are 1-indexed.
const projectNoteTypes = ["", "Internal Note", "Status Update"];

const ProjectComments = (props) => {
  const isStatusEditModal = props.modal;
  let { projectId } = useParams();
  const classes = useStyles();
  const userSessionData = getSessionDatabaseData();
  const [noteText, setNoteText] = useState("");
  const [commentAddLoading, setCommentAddLoading] = useState(false);
  const [commentAddSuccess, setCommentAddSuccess] = useState(false);
  const [editingComment, setEditingComment] = useState(false);
  const [commentId, setCommentId] = useState(null);
  const [displayNotes, setDisplayNotes] = useState([]);
  const [noteType, setNoteType] = useState(isStatusEditModal ? 2 : 0);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);

  // if component is being used in edit modal from dashboard
  // get project id from props instead of url params
  if (isStatusEditModal) {
    projectId = props.projectId;
  }

  const { loading, error, data, refetch } = useQuery(COMMENTS_QUERY, {
    variables: {
      projectNoteConditions: {
        project_id: { _eq: Number(projectId) },
        is_deleted: { _eq: false },
      },
    },
    fetchPolicy: "no-cache",
  });

  const mopedProjNotes = data?.moped_proj_notes;

  const [addNewComment] = useMutation(ADD_PROJECT_COMMENT, {
    onCompleted() {
      setNoteText("");
      refetch();
      setCommentAddSuccess(true);
      setTimeout(() => {
        setCommentAddLoading(false);
        setCommentAddSuccess(false);
        if (isStatusEditModal) {
          props.closeModalDialog();
        }
      }, 350);
    },
  });

  const [editExistingComment] = useMutation(UPDATE_PROJECT_COMMENT, {
    onCompleted() {
      setNoteText("");
      refetch();
      if (isStatusEditModal) {
        props.closeModalDialog();
      } else {
        // refetch the project summary query passed down from ProjectView
        props.refetch();
      }
      setCommentAddSuccess(true);
      setEditingComment(false);
      setTimeout(() => {
        setCommentAddLoading(false);
        setCommentAddSuccess(false);
      }, 350);
    },
  });

  const [deleteExistingComment] = useMutation(DELETE_PROJECT_COMMENT, {
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

  const submitNewComment = () => {
    setCommentAddLoading(true);
    addNewComment({
      variables: {
        objects: [
          {
            added_by: getUserFullName(userSessionData),
            project_note: DOMPurify.sanitize(noteText),
            project_id: projectId,
            added_by_user_id: Number(userSessionData.user_id),
            project_note_type: isStatusEditModal ? 2 : 1,
          },
        ],
      },
    });
  };

  const editComment = (index, project_note_id) => {
    setEditingComment(true);
    setNoteText(displayNotes[index].project_note);
    setCommentId(project_note_id);
  };

  const cancelCommentEdit = () => {
    setNoteText("");
    setEditingComment(false);
    setCommentId(null);
  };

  const submitEditComment = (project_note_id) => {
    setCommentAddLoading(true);
    setCommentId(null);
    editExistingComment({
      variables: {
        projectNote: DOMPurify.sanitize(noteText),
        projectId: Number(projectId),
        projectNoteId: commentId,
      },
    });
  };

  const submitDeleteComment = (project_note_id) => {
    deleteExistingComment({
      variables: {
        projectId: Number(projectId),
        projectNoteId: project_note_id,
      },
    });
  };

  /**
   * Updates the type based on conditions
   * @param {Number} typeId
   */
  const filterNoteType = (typeId) => setNoteType(Number(typeId));

  // when the data changes, update the display notes state
  useEffect(() => {
    if (!loading && data) {
      setDisplayNotes(data.moped_proj_notes);
    }
  }, [loading, data]);

  /**
   * Whenever noteType changes, filter the notes being displayed
   */
  useEffect(() => {
    if (noteType === 0) {
      // show all the notes
      setDisplayNotes(mopedProjNotes);
    } else {
      // on first few renders, mopedProjNotes is still undefined.
      // Check to see if array exists before trying to filter
      const filteredNotes = mopedProjNotes
        ? mopedProjNotes.filter((n) => n.project_note_type === noteType)
        : [];
      setDisplayNotes(filteredNotes);
    }
  }, [noteType, mopedProjNotes]);

  if (error) return console.log(error);

  /**
   * Defines the CommentButton with a toggle style-change behavior.
   * @param {Object} props
   * @return {JSX.Element}
   * @constructor
   */
  const CommentButton = (props) => (
    <Button
      color="primary"
      className={classes.showButtonItem}
      variant={noteType === props.noteTypeId ? "contained" : "outlined"}
      onClick={() => filterNoteType(props.noteTypeId)}
    >
      {props.children}
    </Button>
  );

  const handleDeleteOpen = (id) => {
    setIsDeleteConfirmationOpen(true);
    setDeleteConfirmationId(id);
  };

  return (
    <CardContent>
      <Grid container spacing={2}>
        {/*New Note Form*/}
        {!editingComment && (
          <Grid item xs={12}>
            <Card>
              <CommentInputQuill
                noteText={noteText}
                setNoteText={setNoteText}
                editingComment={editingComment}
                commentAddLoading={commentAddLoading}
                commentAddSuccess={commentAddSuccess}
                submitNewComment={submitNewComment}
                submitEditComment={submitEditComment}
                cancelCommentEdit={cancelCommentEdit}
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
            <CommentButton noteTypeId={0}>All</CommentButton>
            <CommentButton noteTypeId={1}>Internal Notes</CommentButton>
            <CommentButton noteTypeId={2}>Status Updates</CommentButton>
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
                  type="comment"
                  submitDelete={() => submitDeleteComment(deleteConfirmationId)}
                  isDeleteConfirmationOpen={isDeleteConfirmationOpen}
                  setIsDeleteConfirmationOpen={setIsDeleteConfirmationOpen}
                >
                  {displayNotes.map((item, i) => {
                    const isNotLastItem = i < displayNotes.length - 1;
                    /**
                     * Only allow the user who wrote the status to edit it
                     */
                    const editableComment =
                      userSessionData.user_id === item.added_by_user_id;
                    return (
                      <React.Fragment key={item.project_note_id}>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar />
                          </ListItemAvatar>
                          <ListItemText
                            className={
                              editableComment ? classes.editableComment : ""
                            }
                            primary={
                              <>
                                <Typography
                                  component={"span"}
                                  className={classes.commentorText}
                                >
                                  {item.added_by}
                                </Typography>
                                <Typography
                                  component={"span"}
                                  className={classes.commentDate}
                                >
                                  {` - ${makeUSExpandedFormDateFromTimeStampTZ(
                                    item.date_created
                                  )} ${makeHourAndMinutesFromTimeStampTZ(
                                    item.date_created
                                  )}`}
                                </Typography>
                                <Typography
                                  component={"span"}
                                  className={classes.noteType}
                                >
                                  {` ${
                                    projectNoteTypes[item.project_note_type]
                                  }`}
                                </Typography>
                              </>
                            }
                            secondary={
                              commentId === item.project_note_id ? (
                                <CommentInputQuill
                                  noteText={noteText}
                                  setNoteText={setNoteText}
                                  editingComment={editingComment}
                                  commentAddLoading={commentAddLoading}
                                  commentAddSuccess={commentAddSuccess}
                                  submitNewComment={submitNewComment}
                                  submitEditComment={submitEditComment}
                                  cancelCommentEdit={cancelCommentEdit}
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
                            // show edit/delete icons if comment authored by logged in user
                            // or user is admin
                            editableComment && (
                              <ListItemSecondaryAction
                                className={classes.editControls}
                              >
                                {commentId !== item.project_note_id && (
                                  <IconButton
                                    edge="end"
                                    aria-label="edit"
                                    onClick={() =>
                                      editComment(i, item.project_note_id)
                                    }
                                  >
                                    <EditIcon
                                      className={classes.editDeleteButtons}
                                    />
                                  </IconButton>
                                )}
                                {!editingComment && (
                                  <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() =>
                                      handleDeleteOpen(item.project_note_id)
                                    }
                                  >
                                    <DeleteIcon
                                      className={classes.editDeleteButtons}
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
                No comments to display
              </Typography>
            )}
          </Card>
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default ProjectComments;
