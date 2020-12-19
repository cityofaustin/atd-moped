import React, { useState, useRef } from "react";
import JoditEditor from "jodit-react";
import { useQuery, useMutation } from "@apollo/react-hooks";
// import { Link as RouterLink } from "react-router-dom";
import { gql } from "apollo-boost";
import { makeStyles } from "@material-ui/core/styles";
import Page from "src/components/Page";
//import PropTypes from "prop-types";
import {
  Button,
  Box,
  Container,
  Card,
  Divider,
  CardActions,
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

const ProjectNotes = ({}) => {
  const { userId } = useParams();
  const classes = useStyles();
  const editor = useRef(null);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const onBlur = event => {
    const editorValue = event.target;
    setContent(editorValue);
    console.log(editorValue);
  };

  const config = {
    readonly: false, // all options from https://xdsoft.net/jodit/doc/
  };

  const NOTES_MUTATION = gql`
    mutation Notes($project_note: String! = "") {
      insert_moped_proj_notes(
        objects: { project_note: $project_note, project_id: 1 }
      ) {
        affected_rows
        returning {
          project_id
          project_note
          comm_id
        }
      }
    }
  `;

  let project_note = "";

  const [addNote] = useMutation(NOTES_MUTATION);

  const handleNotePost = () => {
    // Change the initial state...
    setLoading(true);

    addNote({
      project_note,
    })
      .then(() => {})
      .catch(err => {
        alert(err);
        setLoading(false);
      })
      .catch(err => {
        alert(err);
        setLoading(false);
      });
  };
  const USER_QUERY = gql`
    query User($userId: Int) {
      moped_users(where: { user_id: { _eq: $userId } }) {
        first_name
        last_name
      }
    }
  `;

  const { loading: userLoading, error: userError, data: userData } = useQuery(
    USER_QUERY,
    {
      variables: { userId },
    }
  );
  if (userLoading) return <CircularProgress />;
  if (userError) return `Error! ${userError.message}`;

  return (
    <Page title="Project Notes Page">
      <Container>
        <Card className={classes.cardWrapper}>
          <div className={classes.root}>
            <Box p={4} pb={2}>
              <Typography color="textPrimary" variant="h6">
                Created by:
                {userData.moped_users[0].first_name}
                {userData.moped_users[0].last_name}
              </Typography>
            </Box>
          </div>
          <Divider />
          <Box></Box>
          <JoditEditor
            ref={editor}
            value={content}
            config={config}
            tabIndex={1} // tabIndex of textarea
            onBlur={onBlur}
          />
          <Divider />
          <CardActions className={classes.cardActions}>
            <Button
              className={classes.button}
              loading={loading}
              onClick={handleNotePost}
            >
              Post
            </Button>
          </CardActions>
        </Card>
      </Container>
    </Page>
  );
};

export default ProjectNotes;
