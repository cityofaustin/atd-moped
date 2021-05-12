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

const CreateNewComment = props => {
  const classes = useStyles();
  const config = {
    readonly: false, // all options from https://xdsoft.net/jodit/doc/
  };
  return (
    <>
      <form onSubmit={props.saveNote}>
        <h3>Create New Note</h3>
        <JoditEditor
          ref={props.getContent}
          value={props.content}
          config={config}
          onBlur={props.saveNoteContentToState}
          tabIndex={1} // tabIndex of textarea
        />
        <Box>
          <Button type="submit" className={classes.button}>
            Save Note
          </Button>
        </Box>
      </form>
    </>
  );
};
export default CreateNewComment;
