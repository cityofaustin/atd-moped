import React from "react";
import DisplayAllComments from "./DisplayAllComments";
import Page from "src/components/Page";
import {
  Container,
  Card,
  CircularProgress,
  List,
  ListItem,
  Divider,
  ListItemText,
  ListItemAvatar,
  Typography,
  Avatar,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useParams } from "react-router-dom";
import MaterialTable, { MTableAction } from "material-table";

const NOTES_QUERY = gql`
  query getProjectNotes($projectId: Int!) {
    moped_proj_notes(where: { project_id: { _eq: $projectId } }) {
      added_by
      project_note
      project_id
      date_created
      project_note_id
    }
  }
`;

// const NOTES_MUTATION = gql`
//   mutation Notes($project_note: String! = "") {
//     insert_moped_proj_notes(
//       objects: { project_note: $project_note, project_id: 1 }
//     ) {
//       affected_rows
//       returning {
//         project_id
//         project_note
//       }
//     }
//   }
// `;

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

  const { loading, error, data } = useQuery(NOTES_QUERY, {
    variables: { projectId },
  });

  console.log(data);

  // If the query is loading or data object is undefined,
  // stop here and just render the spinner.
  if (loading || !data) return <CircularProgress />;

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
      </Container>
    </Page>
  );
};

export default ProjectComments;
