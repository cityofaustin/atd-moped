import React from "react";
import { Button, Box, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import JoditEditor from "jodit-react";

const useStyles = makeStyles(theme => ({
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(2),
  },
}));

const Note = ({ content, editNote, id, deleteNote }) => {
  const classes = useStyles();
  const config = {
    readonly: true,
    toolbar: false,
    allowResizeX: true,
    height: 100,
    // all options from https://xdsoft.net/jodit/doc/
  };
  return (
    <>
      <Box>
        <Divider />
        <JoditEditor
          value={content}
          config={config}
          tabIndex={1} // tabIndex of textarea
        />
        <Divider />
        <Button onClick={() => editNote(id)} className={classes.button}>
          Edit
        </Button>
        <Button onClick={() => deleteNote(id)} className={classes.button}>
          Delete
        </Button>
      </Box>
      <Divider />
    </>
  );
};
export default Note;
