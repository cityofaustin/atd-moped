import React, { useState } from "react";
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
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

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
  noteText: {
    marginTop: theme.spacing(1),
  },
  emptyState: {
    margin: theme.spacing(3),
  },
}));

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

  const { loading, error, data, refetch } = useQuery(COMMENTS_QUERY, {
    variables: { projectId },
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

  // If the query is loading or data object is undefined,
  // stop here and just render the spinner.
  if (loading || !data) return <CircularProgress />;

  if (error) return console.log(error);

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

  return (
    <Page title="Project Notes">
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card>
              {data.moped_proj_notes.length > 0 ? (
                <List className={classes.root}>
                  {data.moped_proj_notes.map((item, i) => {
                    let isNotLastItem = i < data.moped_proj_notes.length - 1;
                    return (
                      <>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar />
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <>
                                <Typography className={classes.commentorText}>
                                  {item.added_by}
                                </Typography>
                                <Typography variant="button">
                                  {` - ${new Date(
                                    item.date_created
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}`}
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
                          (userSessionData.user_id === item.added_by_user_id ||
                            userHighestRole === "moped-admin") && (
                            <ListItemSecondaryAction>
                              {commentId !== item.project_note_id && (
                                <IconButton
                                  edge="end"
                                  aria-label="edit"
                                  onClick={() =>
                                    editComment(i, item.project_note_id)
                                  }
                                >
                                  <EditIcon />
                                </IconButton>
                              )}
                              <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={() =>
                                  submitDeleteComment(item.project_note_id)
                                }
                              >
                                <DeleteIcon />
                              </IconButton>
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
        </Grid>
      </Container>
    </Page>
  );
};

export default ProjectComments;
