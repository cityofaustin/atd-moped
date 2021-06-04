import React, { useState } from "react";
import Page from "src/components/Page";
import {
  Avatar,
  Box,
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
import AddBoxIcon from "@material-ui/icons/AddBox";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

import { makeStyles } from "@material-ui/core/styles";
import { getSessionDatabaseData } from "src/auth/user";
import { useQuery, useMutation } from "@apollo/client";
import { gql } from "apollo-boost";
import { useParams } from "react-router-dom";
import parse from "html-react-parser";
import DOMPurify from "dompurify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ProjectSaveButton from "../newProjectView/ProjectSaveButton";

const COMMENTS_QUERY = gql`
  query getProjectComments($projectId: Int!) {
    moped_proj_notes(where: { project_id: { _eq: $projectId } }) {
      added_by
      project_note
      project_id
      date_created
      project_note_id
    }
  }
`;

const ADD_PROJECT_COMMENT = gql`
  mutation AddProjectComment($objects: [moped_proj_notes_insert_input!]!) {
    insert_moped_proj_notes(objects: $objects) {
      returning {
        project_id
        project_note
      }
    }
  }
`;

const quillModules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

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
  const classes = useStyles();
  const userSessionData = getSessionDatabaseData();
  const [noteText, setNoteText] = useState("");
  const [commentAddLoading, setCommentAddLoading] = useState(false);
  const [commentAddSuccess, setCommentAddSuccess] = useState(false);

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
          },
        ],
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
                              <Typography className={classes.noteText}>
                                {parse(item.project_note)}
                              </Typography>
                            }
                          />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="edit">
                              <EditIcon />
                            </IconButton>
                            <IconButton edge="end" aria-label="delete">
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
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
          <Grid item xs={12}>
            <Card>
              <Container>
                <Grid xs={12} sm={10} container direction="column" spacing={1}>
                  <Grid item>
                    <Box pt={2}>
                      <ReactQuill
                        theme="snow"
                        value={noteText}
                        onChange={setNoteText}
                        modules={quillModules}
                      />
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box pb={2}>
                      <ProjectSaveButton
                        label={
                          <>
                            <AddBoxIcon /> <Box ml={1}>Add comment</Box>
                          </>
                        }
                        loading={commentAddLoading}
                        success={commentAddSuccess}
                        handleButtonClick={submitNewComment}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Container>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default ProjectComments;
