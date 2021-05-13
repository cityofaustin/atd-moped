import React, { useState } from "react";
import DisplayAllComments from "./DisplayAllComments";
import Page from "src/components/Page";
import {
  Avatar,
  Button,
  Box,
  Container,
  Card,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@material-ui/core";
import AddBoxIcon from "@material-ui/icons/AddBox";

import { makeStyles } from "@material-ui/core/styles";

import { useQuery, useMutation } from "@apollo/client";
import { gql } from "apollo-boost";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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
  const [noteText, setNoteText] = useState("");

  const { loading, error, data } = useQuery(COMMENTS_QUERY, {
    variables: { projectId },
  });

  const [addNewComment] = useMutation(ADD_PROJECT_COMMENT);

  console.log(data);
  console.log(noteText);

  // If the query is loading or data object is undefined,
  // stop here and just render the spinner.
  if (loading || !data) return <CircularProgress />;

  const submitNewComment = () => {
    addNewComment({
      variables: {
        objects: [
          {
            added_by: "Mateo",
            project_note: noteText,
            project_id: projectId,
            // date_created: "2020-12-03T00:00:00+00:00",
          },
        ],
      },
    });
  };

  return (
    <Page title="Project Notes">
      <Container>
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
                            {item.project_note}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {isNotLastItem && (
                      <Divider variant="inset" component="li" />
                    )}
                  </>
                );
              })}
            </List>
          ) : (
            <Typography className={classes.emptyState}>
              No comments to display
            </Typography>
          )}
          {/* <DisplayAllComments /> */}
        </Card>
        <Card>
          <ReactQuill
            theme="snow"
            value={noteText}
            onChange={setNoteText}
            modules={quillModules}
          />

          <Box pt={2}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<AddBoxIcon />}
              onClick={submitNewComment}
            >
              Add comment
            </Button>
          </Box>
        </Card>
      </Container>
    </Page>
  );
};

export default ProjectComments;
