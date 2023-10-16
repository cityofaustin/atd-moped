import React, { useRef, useEffect } from "react";
import { Box, Button, Container, Grid } from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import makeStyles from "@mui/styles/makeStyles";
import ProjectSaveButton from "../newProjectView/ProjectSaveButton";

const quillModules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  cancelButton: {
    margin: theme.spacing(1),
    position: "relative",
    color: theme.palette.secondary.dark,
  },
  quillText: {
    color: theme.palette.text.primary,
  },
  showButtonItem: {
    margin: theme.spacing(2),
  },
}));

const NoteInputQuill = ({
  noteText,
  setNoteText,
  newNoteType,
  setNewNoteType,
  editingNote,
  noteAddLoading,
  noteAddSuccess,
  submitNewNote,
  submitEditNote,
  cancelNoteEdit,
}) => {
  const classes = useStyles();
  const ref = useRef();

  useEffect(() => {
    // autofocuses the quill input
    ref?.current.focus();
  }, []);

  /**
   * Defines the NewNoteTypeButton with a toggle style-change behavior.
   * @param {Object} props
   * @return {JSX.Element}
   * @constructor
   */
  const NewNoteTypeButton = (props) => (
    <Button
      color="primary"
      className={classes.showButtonItem}
      variant={newNoteType === props.noteTypeId ? "contained" : "outlined"}
      onClick={() => setNewNoteType(props.noteTypeId)}
    >
      {props.children}
    </Button>
  );

  return (
    <Container>
      <Grid container direction="column" spacing={1}>
        <Grid item xs={12} sm={12}>
          <Box className={classes.quillText} pt={2}>
            <ReactQuill
              theme="snow"
              value={noteText}
              onChange={setNoteText}
              modules={quillModules}
              ref={ref}
            />
          </Box>
        </Grid>
        {!editingNote && (
          <Grid
            item
            xs={12}
            display="flex"
            style={{ justifyContent: "flex-end" }}
          >
            <NewNoteTypeButton noteTypeId={1}>Internal Note</NewNoteTypeButton>
            <NewNoteTypeButton noteTypeId={2}>Status Update</NewNoteTypeButton>
          </Grid>
        )}
        <Grid item>
          <Box pb={2} display="flex" style={{ justifyContent: "flex-end" }}>
            {editingNote && (
              <div className={classes.cancelButton}>
                <Button variant="text" onClick={cancelNoteEdit}>
                  Cancel
                </Button>
              </div>
            )}
            <ProjectSaveButton
              // disable save button if no text after removing html tags
              disabled={!noteText.replace(/<[^>]*>/g, "")}
              label={<>Save</>}
              loading={noteAddLoading}
              success={noteAddSuccess}
              handleButtonClick={editingNote ? submitEditNote : submitNewNote}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NoteInputQuill;
