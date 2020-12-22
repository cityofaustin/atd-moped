import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Card,
  Divider,
  CircularProgress,
  Typography,
} from "@material-ui/core";
import {
  // rest of the elements/components imported remain same
  useParams,
} from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  cardWrapper: {
    marginTop: theme.spacing(3),
  },
  cardActions: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(2),
  },
}));

const ProjectNotesPosts = () => {
  const classes = useStyles();
  const { userId } = useParams();

  const USER_QUERY = gql`
    query User($userId: Int) {
      moped_users(where: { user_id: { _eq: $userId } }) {
        first_name
        last_name
      }
    }
  `;

  const NOTES_QUERY = gql`
    query Notes {
      moped_proj_notes(limit: 1, order_by: { project_note_id: desc }) {
        project_note
        date_created
      }
    }
  `;

  const { loading: userLoading, error: userError, data: userData } = useQuery(
    USER_QUERY,
    {
      variables: { userId },
    }
  );

  const {
    loading: notesLoading,
    error: notesError,
    data: notesData,
  } = useQuery(NOTES_QUERY);

  if (userLoading) return <CircularProgress />;
  if (userError) return `Error! ${userError.message}`;

  if (notesLoading) return <CircularProgress />;
  if (notesError) return `Error! ${notesError.message}`;

  return (
    <Card className={classes.cardWrapper}>
      <div className={classes.root}>
        <Box p={4} pb={2}>
          <Typography color="textPrimary" variant="p">
            added by {userData.moped_users[0].first_name}{" "}
            {userData.moped_users[0].last_name}
            {notesData.moped_proj_notes.map(detail => (
              <p key={detail.date_created} value={detail.date_created}>
                {detail.date_created}
                <Divider />
                {detail.project_note}
              </p>
            ))}
          </Typography>
        </Box>
      </div>
      <Divider />
    </Card>
  );
};

export default ProjectNotesPosts;
