import React from "react";
import {
  Box,
  Button,
  Container,
  Grid
} from "@material-ui/core";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import AddBoxIcon from "@material-ui/icons/AddBox";
import CancelIcon from "@material-ui/icons/Cancel";
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

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  cancelButton: {
    margin: theme.spacing(1),
    position: "relative",
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

  return (
    <Container>
      <Grid xs={12} sm={10} container direction="column" spacing={1}>
        <Grid item>
          <Box pt={2}>
            <ReactQuill
              theme="snow"
              value={noteText}
              onChange={setNoteText}
              modules={quillModules}
            />
          </Box>
        </Grid>
        <Grid item>
          <Box pb={2} display="flex">
            <ProjectSaveButton
              label={
                <>
                  <AddBoxIcon />
                  <Box ml={1}>
                    {editingComment ? "Update comment" : "Add comment"}
                  </Box>
                </>
              }
              loading={commentAddLoading}
              success={commentAddSuccess}
              handleButtonClick={
                editingComment ? submitEditComment : submitNewComment
              }
            />
            {editingComment && (
              <div className={classes.cancelButton}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={cancelCommentEdit}
                >
                  <>
                    <CancelIcon /> <Box ml={1}>Cancel</Box>
                  </>
                </Button>
              </div>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CommentInputQuill;
