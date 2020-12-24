import React from "react";
import DisplayAllNotes from "./DisplayAllNotes";
//import React, { useState, useRef } from "react";
//import JoditEditor from "jodit-react";
//import { useMutation } from "@apollo/react-hooks";
//import { gql } from "apollo-boost";
import { makeStyles } from "@material-ui/core/styles";
import Page from "src/components/Page";
//import ProjectNotesPosts from "./ProjectNotesPosts";
import {
  // Button,
  //Box,
  Container,
  Card,
  Divider,
  // CardActions,
} from "@material-ui/core";

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

const ProjectNotes = () => {
  const classes = useStyles();
  // const editor = useRef(null);
  // const [loading, setLoading] = useState(false);
  // const [content, setContent] = useState("");
  // const [showPost, setshowPost] = useState(false);

  // const config = {
  //   readonly: false, // all options from https://xdsoft.net/jodit/doc/
  // };

  // const NOTES_MUTATION = gql`
  //   mutation Notes($project_note: String! = "") {
  //     insert_moped_proj_notes(
  //       objects: { project_note: $project_note, project_id: 1 }
  //     ) {
  //       affected_rows
  //       returning {
  //         project_id
  //         project_note
  //         comm_id
  //       }
  //     }
  //   }
  // `;

  // const [addNote] = useMutation(NOTES_MUTATION);

  // const onBlur = event => {
  //   const editorValue = event.target.innerText;
  //   setContent(editorValue);
  //   let project_note = editorValue;
  //   addNote({ variables: { project_note } });
  // };

  // const handleNotePost = () => {
  //   // Change the initial state...
  //   setLoading(true);
  //   setshowPost(true);
  //   setContent("");
  // };

  return (
    <Page title="Project Notes Page">
      <Container>
        <Card className={classes.cardWrapper}>
          {/* <JoditEditor
            ref={editor}
            value={content}
            config={config}
            onBlur={onBlur}
            tabIndex={1} // tabIndex of textarea
          />
          <Divider />
          <CardActions className={classes.cardActions}>
            <Button
              className={classes.button}
              loading={loading}
              showPost={showPost}
              onClick={handleNotePost}
            >
              Post
            </Button>
          </CardActions>
          <Box p={4} pb={2}>
            {showPost ? <ProjectNotesPosts /> : null}
          </Box> */}
          <DisplayAllNotes />
          <Divider />
        </Card>
      </Container>
    </Page>
  );
};

export default ProjectNotes;
