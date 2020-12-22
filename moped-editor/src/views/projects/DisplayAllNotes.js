import React, { useState, useRef } from "react";
import CreateNewNote from "./CreateNewNote";
import Note from "./Note";
import ModifyNote from "./ModifyNote";
import { Button, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(2),
  },
}));

const DisplayAllNotes = () => {
  const classes = useStyles();

  const [content, setContent] = useState("");
  const [allNotes, setAllNotes] = useState([]);
  const [isCreateNewNote, setIsCreateNewNote] = useState(false);
  const [isModifyNote, setIsModifyNote] = useState(false);
  const [editNoteId, setEditNoteId] = useState("");

  // Initialize useRef
  const getContent = useRef(null);

  const saveNoteContentToState = event => {
    setContent(event.target.innerHTML);
  };
  const toggleCreateNewNote = () => {
    setIsCreateNewNote(!isCreateNewNote);
  };
  const toggleModifyNoteComponent = () => {
    setIsModifyNote(!isModifyNote);
  };
  const editNote = id => {
    setEditNoteId(id);
    console.log(id);
    toggleModifyNoteComponent();
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
        console.log([eachNote.id, editNoteId]);
        return {
          ...eachNote,
          content: content || eachNote.content,
        };
      }
      console.log(eachNote);
      return eachNote;
    });
    setAllNotes(updatedNote);
    toggleModifyNoteComponent();
  };
  const saveNote = event => {
    event.preventDefault();
    const id = Date.now();
    setAllNotes([...allNotes, { content, id }]);
    console.log(allNotes);
    setContent("");
    getContent.current.value = "";
    toggleCreateNewNote();
  };
  if (isCreateNewNote) {
    return (
      <>
        <CreateNewNote
          saveNoteContentToState={saveNoteContentToState}
          getContent={getContent}
          saveNote={saveNote}
          deleteNote={deleteNote}
        />
      </>
    );
  } else if (isModifyNote) {
    const note = allNotes.find(note => {
      return note.id === editNoteId;
    });
    return (
      <ModifyNote
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
            <Button onClick={toggleCreateNewNote} className={classes.button}>
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
                <Note
                  id={eachNote.id}
                  key={eachNote.id}
                  content={eachNote.content}
                  editNote={editNote}
                  deleteNote={deleteNote}
                />
              );
            })}
            <Box>
              <Button onClick={toggleCreateNewNote} className={classes.button}>
                Create New
              </Button>
            </Box>
          </section>
        </div>
      )}
    </>
  );
};
export default DisplayAllNotes;
