import React, { useRef, useEffect } from "react";
import { Box, Button, Container, Grid } from "@material-ui/core";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { makeStyles } from "@material-ui/core/styles";
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
}));

const CommentInputQuill = ({
  noteText,
  setNoteText,
  editingComment,
  commentAddLoading,
  commentAddSuccess,
  submitNewComment,
  submitEditComment,
  cancelCommentEdit,
}) => {
  const classes = useStyles();
  const ref = useRef();

  useEffect(() => {
    // autofocuses the quill input
    ref?.current.focus();
  }, []);

  return (
    <Container>
      <Grid container direction="column" spacing={1}>
        <Grid item xs={12} sm={12}>
          <Box pt={2}>
            <ReactQuill
              theme="snow"
              value={noteText}
              onChange={setNoteText}
              modules={quillModules}
              ref={ref}
            />
          </Box>
        </Grid>
        <Grid item>
          <Box pb={2} display="flex" style={{ justifyContent: "flex-end" }}>
            {editingComment && (
              <div className={classes.cancelButton}>
                <Button variant="text" onClick={cancelCommentEdit}>
                  Cancel
                </Button>
              </div>
            )}
            <ProjectSaveButton
              label={<>Save</>}
              loading={commentAddLoading}
              success={commentAddSuccess}
              handleButtonClick={
                editingComment ? submitEditComment : submitNewComment
              }
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CommentInputQuill;
