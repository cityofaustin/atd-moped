import React, { useEffect, useState } from "react";
import Page from "src/components/Page";
import {
  Avatar,
  Container,
  Card,
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
import { getSessionDatabaseData, getHighestRole, useUser } from "src/auth/user";
import { useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import parse from "html-react-parser";
import DOMPurify from "dompurify";
import CommentInputQuill from "./CommentInputQuill";

// Query
import {
  COMMENTS_QUERY,
  ADD_PROJECT_COMMENT,
  UPDATE_PROJECT_COMMENT,
  DELETE_PROJECT_COMMENT,
} from "../../../queries/comments";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  commentorText: {
    display: "inline",
    fontWeight: "bold",
  },
  commentDate: {
    display: "inline",
  },
  editableComment: {
    marginRight: "30px",
  },
  noteType: {
    display: "inline",
    marginLeft: "12px",
    color: theme.palette.primary.main,
    textTransform: "uppercase",
  },
  emptyState: {
    margin: theme.spacing(3),
  },
  showButtonItem: {
    margin: theme.spacing(2),
  },
  editDeleteButtons: {
    color: "#000000",
  }
}));

 // Lookup array to convert project note types to a human readable interpretation 
 // The zeroth item in the list is intentionally blank; the notes are 1-indexed.
const projectNoteTypes = ['', 'Internal Note', 'Status Update', 'Timeline Notes'];

const ProjectComments = () => {
  const { projectId } = useParams();
  const { user } = useUser();
  const userHighestRole = getHighestRole(user);
  const classes = useStyles();
  const userSessionData = getSessionDatabaseData();
  const [noteText, setNoteText] = useState("");
  const [commentAddLoading, setCommentAddLoading] = useState(false);
  const [commentAddSuccess, setCommentAddSuccess] = useState(false);
  const [editingComment, setEditingComment] = useState(false);
  const [commentId, setCommentId] = useState(null);
  const [noteType, setNoteType] = useState(0);
  const [noteTypeConditions, setNoteTypeConditions] = useState({});

  const { loading, error, data, refetch } = useQuery(COMMENTS_QUERY, {
    variables: {
      projectNoteConditions: {
        project_id: { _eq: Number(projectId) },
        status_id: { _eq: Number(1) },
        ...noteTypeConditions,
      },
    },
  });

  const [addNewComment] = useMutation(ADD_PROJECT_COMMENT, {
    onCompleted() {
      setNoteText("");
      refetch();
      setCommentAddSuccess(true);
      setTimeout(() => {
        setCommentAddLoading(false);
        setCommentAddSuccess(false);
      }, 350);
    },
  });

  const [editExistingComment] = useMutation(UPDATE_PROJECT_COMMENT, {
    onCompleted() {
      setNoteText("");
      refetch();
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
    },
  });

  const submitNewComment = () => {
    setCommentAddLoading(true);
    addNewComment({
      variables: {
        objects: [
          {
            added_by: `${userSessionData.first_name} ${userSessionData.last_name}`,
            project_note: DOMPurify.sanitize(noteText),
            project_id: projectId,
            status_id: 1,
            added_by_user_id: Number(userSessionData.user_id),
            project_note_type: 1,
          },
        ],
      },
    });
  };

  const editComment = (index, project_note_id) => {
    setEditingComment(true);
    setNoteText(data.moped_proj_notes[index].project_note);
    setCommentId(project_note_id);
  };

  const cancelCommentEdit = () => {
    setNoteText("");
    setEditingComment(false);
    setCommentId(null);
  };

  const submitEditComment = project_note_id => {
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

  const submitDeleteComment = project_note_id => {
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
  const filterNoteType = typeId => setNoteType(Number(typeId));

  /**
   * Whenever noteType changes, we change the query conditions
   */
  useEffect(() => {
    if (noteType === 0) {
      setNoteTypeConditions({});
    } else {
      setNoteTypeConditions({
        project_note_type: { _eq: noteType },
      });
    }
    refetch();
  }, [noteType, setNoteTypeConditions, refetch]);

  // If the query is loading or data object is undefined,
  // stop here and just render the spinner.
  if (loading || !data) return <CircularProgress />;
  if (error) return console.log(error);

  /**
   * Defines the CommentButton with a toggle style-change behavior.
   * @param {Object} props
   * @return {JSX.Element}
   * @constructor
   */
  const CommentButton = props => (
    <Button
      {...props}
      color="primary"
      className={classes.showButtonItem}
      variant={noteType === props.noteTypeId ? "contained" : "outlined"}
      onClick={() => filterNoteType(props.noteTypeId)}
    >
      {props.children}
    </Button>
  );

  return (
    <Page title="Project Notes">
      <Container>
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
          <Grid item xs={12}>
            <FormControlLabel
              className={classes.showButtonItem}
              label="Show"
              control={<span />}
            />
            <CommentButton noteTypeId={0}>All</CommentButton>
            <CommentButton noteTypeId={1}>Internal Notes</CommentButton>
            <CommentButton noteTypeId={2}>Status Updates</CommentButton>
            <CommentButton noteTypeId={3}>Timeline Notes</CommentButton>
          </Grid>
          {/*Now the notes*/}
          <Grid item xs={12}>
            <Card>
              {data.moped_proj_notes.length > 0 ? (
                <List className={classes.root}>
                  {data.moped_proj_notes.map((item, i) => {
                    let isNotLastItem = i < data.moped_proj_notes.length - 1;
                    //let editableComment = (userSessionData.user_id === item.added_by_user_id ||
                                           //userHighestRole === "moped-admin");
                    let editableComment = (Math.random() > .5) ? true : false;

                    return (
                      <>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar />
                          </ListItemAvatar>
                          <ListItemText
                            className={editableComment ? classes.editableComment : ""}
                            primary={
                              <>
                                <Typography className={classes.commentorText}>
                                  {item.added_by}
                                </Typography>
                                <Typography className={classes.commentDate}>
                                  {` - ${new Date(
                                    item.date_created
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })} ${new Date(
                                    item.date_created
                                  ).toLocaleTimeString("en-US", {
                                    hour: "numeric",
                                    minute: "numeric",
                                  })}`}
                                </Typography>
                                <Typography className={classes.noteType}>
                                  {` ${projectNoteTypes[item.project_note_type]}`}
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
                                <Typography className={classes.newNoteText}>
                                  {parse(item.project_note)}
                                </Typography>
                              )
                            }
                          />
                          {// show edit/delete icons if comment authored by logged in user
                          // or user is admin
                          editableComment && (
                            <ListItemSecondaryAction>
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
                                    submitDeleteComment(item.project_note_id)
                                  }
                                >
                                  <DeleteIcon
                                    className={classes.editDeleteButtons}
                                  />
                                </IconButton>
                              )}
                            </ListItemSecondaryAction>
                          )}
                        </ListItem>
                        {isNotLastItem && <Divider component="li" />}
                      </>
                    );
                  })}
                </List>
              ) : (
                <Typography className={classes.emptyState}>
                  No comments to display
                </Typography>
              )}
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default ProjectComments;
