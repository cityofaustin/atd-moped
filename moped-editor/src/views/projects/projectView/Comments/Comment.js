import React from "react";
import { Button, Box, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import JoditEditor from "jodit-react";
import { useUser } from "src/auth/user";

const useStyles = makeStyles(theme => ({
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(2),
  },
}));

const Comment = ({ content, editComment, id, deleteComment }) => {
  const classes = useStyles();
  const config = {
    readonly: true,
    toolbar: false,
    allowResizeX: true,
    height: 100,
    // all options from https://xdsoft.net/jodit/doc/
  };

  const parseDateReadable = date => {
    return new Date(date).toLocaleDateString();
  };

  const { user } = useUser();
  let userArray = Object.values(user);
  return (
    <>
      <Box>
        <Divider />
        <p>Created on: {parseDateReadable(Date.now())}</p>
        <p>Created by: {userArray[0]}</p>
        <JoditEditor
          value={content}
          config={config}
          tabIndex={1} // tabIndex of textarea
        />
        <Divider />
        <Button onClick={() => editComment(id)} className={classes.button}>
          Edit
        </Button>
        <Button onClick={() => deleteComment(id)} className={classes.button}>
          Delete
        </Button>
      </Box>
      <Divider />
    </>
  );
};
export default Comment;
