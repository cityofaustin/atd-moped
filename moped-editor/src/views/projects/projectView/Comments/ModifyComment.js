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

const ModifyComment = props => {
  const classes = useStyles();
  return (
    <>
      <form onSubmit={props.updateNote}>
        <h3>Modify Comment</h3>
        <JoditEditor
          value={props.content}
          onBlur={props.saveNoteContentToState}
          tabIndex={1} // tabIndex of textarea
        />
        <Box>
          <Button type="submit" className={classes.button}>
            Update Comment
          </Button>
        </Box>
      </form>
    </>
  );
};
export default ModifyComment;
