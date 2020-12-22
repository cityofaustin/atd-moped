import React from "react";
import JoditEditor from "jodit-react";
import { Button, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(2),
  },
}));

const ModifyNote = props => {
  const classes = useStyles();
  return (
    <>
      <h3>Modify Note</h3>
      <JoditEditor
        value={props.content}
        onBlur={props.saveNoteContentToState}
        tabIndex={1} // tabIndex of textarea
      />
      <Box>
        <Button onClick={props.updateNote} className={classes.button}>
          Update Note
        </Button>
      </Box>
    </>
  );
};
export default ModifyNote;
