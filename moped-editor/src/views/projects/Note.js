import React from "react";
import { Button, Box, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(2),
  },
}));

const Note = ({ content, editNote, id, deleteNote }) => {
  const classes = useStyles();
  return (
    <>
      <Box>
        <Divider />
        <p>{content}</p>
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
