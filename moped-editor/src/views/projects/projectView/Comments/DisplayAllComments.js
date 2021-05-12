import React, { useState, useRef } from "react";
import CreateNewComment from "./CreateNewComment";
import Comment from "./Comment";
import ModifyComment from "./ModifyComment";
import { Button, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useMutation } from "@apollo/client";
import { gql } from "apollo-boost";

const useStyles = makeStyles(theme => ({
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(2),
  },
}));

const DisplayAllComments = () => {
  const classes = useStyles();

  const [content, setContent] = useState("");
  const [allNotes, setAllNotes] = useState([]);
  const [isCreateNewComment, setIsCreateNewComment] = useState(false);
  const [isModifyComment, setIsModifyComment] = useState(false);
  const [editNoteId, setEditNoteId] = useState("");

  // Initialize useRef
  const getContent = useRef(null);

  const NOTES_MUTATION = gql`
    mutation Notes($project_note: String! = "") {
      insert_moped_proj_notes(
        objects: { project_note: $project_note, project_id: 1 }
      ) {
        affected_rows
        returning {
          project_id
          project_note
        }
      }
    }
  `;

  const [sendNote] = useMutation(NOTES_MUTATION);

  const saveNoteContentToState = event => {
    setContent(event.target.innerHTML);
  };
  const toggleCreateNewComment = () => {
    setIsCreateNewComment(!isCreateNewComment);
  };
  const toggleModifyCommentComponent = () => {
    setIsModifyComment(!isModifyComment);
  };
  const editNote = id => {
    setEditNoteId(id);
    toggleModifyCommentComponent();
  };
  const deleteNote = id => {
    const modifiedNote = allNotes.filter(eachNote => {
      return eachNote.id !== id;
    });
    setAllNotes(modifiedNote);
  };
  const updateNote = event => {
    event.preventDefault();
    const updatedNote = allNotes.map(eachNote => {
      if (eachNote.id === editNoteId) {
        return {
          ...eachNote,
          content: content || eachNote.content,
        };
      }
      return eachNote;
    });
    setAllNotes(updatedNote);
    toggleModifyCommentComponent();
  };
  const saveNote = event => {
    event.preventDefault();
    const id = Date.now();
    setAllNotes([...allNotes, { content, id }]);
    allNotes.forEach(eachNote => {
      let project_note = eachNote.content;
      sendNote({ variables: { project_note } });
    });
    setContent("");
    getContent.current.value = "";
    toggleCreateNewComment();
  };
  if (isCreateNewComment) {
    return (
      <>
        <CreateNewComment
          getContent={getContent}
          saveNoteContentToState={saveNoteContentToState}
          saveNote={saveNote}
          deleteNote={deleteNote}
        />
      </>
    );
  } else if (isModifyComment) {
    const note = allNotes.find(note => {
      return note.id === editNoteId;
    });
    return (
      <ModifyComment
        content={note.content}
        updateNote={updateNote}
        saveNoteContentToState={saveNoteContentToState}
      />
    );
  }
  return (
    <>
      {!allNotes.length ? (
        <section>
          <h3>No Notes Found!</h3>
          <br />
          <br />
          <Box>
            <Button onClick={toggleCreateNewComment} className={classes.button}>
              Create New
            </Button>
          </Box>
        </section>
      ) : (
        <div>
          <h3>All Notes</h3>
          <section>
            {allNotes.map(eachNote => {
              return (
                <Comment
                  id={eachNote.id}
                  key={eachNote.id}
                  content={eachNote.content}
                  editNote={editNote}
                  deleteNote={deleteNote}
                />
              );
            })}
            <Box>
              <Button
                onClick={toggleCreateNewComment}
                className={classes.button}
              >
                Create New
              </Button>
            </Box>
          </section>
        </div>
      )}
    </>
  );
};
export default DisplayAllComments;
