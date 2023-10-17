import React, { useRef, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  FormControl,
  Radio,
  RadioGroup,
  FormLabel,
  FormControlLabel,
} from "@mui/material";
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

/**
 * Defines the NoteTypeRadioButtons with a toggle style-change behavior.
 * @param {Object} props
 * @return {JSX.Element}
 * @constructor
 */
const NoteTypeRadioButtons = (props) => (
  <RadioGroup
    row
    aria-labelledby="demo-radio-buttons-group-label"
    defaultValue={props.defaultValue}
    name="radio-buttons-group"
    onChange={props.onChange}
  >
    <FormControlLabel value={1} control={<Radio />} label="Internal" />
    <FormControlLabel value={2} control={<Radio />} label="Status update" />
  </RadioGroup>
);

const NoteInputQuill = ({
  noteText,
  setNoteText,
  newNoteType,
  setNewNoteType,
  editingNoteType,
  setEditingNoteType,
  editingNote,
  noteAddLoading,
  noteAddSuccess,
  submitNewNote,
  submitEditNote,
  cancelNoteEdit,
}) => {
  const classes = useStyles();
  const ref = useRef();

  console.log(noteText, "this is note text");
  // console.log(editingNoteType);

  useEffect(() => {
    // autofocuses the quill input
    ref?.current.focus();
  }, []);

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
        <Grid
          item
          xs={12}
          display="flex"
          style={{ justifyContent: "flex-end" }}
        >
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">Note type</FormLabel>
            {!editingNote ? (
              <NoteTypeRadioButtons
                onChange={(e) => setNewNoteType(e.target.value)}
                defaultValue={newNoteType}
              ></NoteTypeRadioButtons>
            ) : (
              <NoteTypeRadioButtons
                onChange={(e) => setEditingNoteType(e.target.value)}
                defaultValue={editingNoteType}
              ></NoteTypeRadioButtons>
            )}
          </FormControl>
        </Grid>
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
