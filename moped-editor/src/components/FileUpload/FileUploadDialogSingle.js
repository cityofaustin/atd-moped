import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Icon,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import FileUpload from "./FileUpload";

import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  title: {
    padding: "0rem 0 2rem 0",
  },
  uploadFileButton: {
    float: "right",
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  textField: {
    marginTop: "1rem",
  },
  selectField: {
    marginTop: "1rem",
    width: "200px",
  },
  inputFieldAdornmentColor: {
    color: "grey",
  },
}));

const FileUploadDialogSingle = (props) => {
  const classes = useStyles();

  /**
   * @constant {string} fileName - Contains a human-readable file name
   * @constant {string} fileType- Contains an integer representing file type
   * @constant {string} fileDescription - Contains a human-readable file description
   * @constant {string} fileKey - The location of the file in S3
   * @constant {Object} fileObject - Contains the file object, including metadata.
   * @constant {bool} fileReady - True if we have everything we need to commit the file to the DB
   */
  const [fileName, setFileName] = useState(null);
  const [fileType, setFileType] = useState("");
  const [fileDescription, setFileDescription] = useState(null);
  const [fileKey, setFileKey] = useState(null);
  const [fileObject, setFileObject] = useState(null);
  const [fileReady, setFileReady] = useState(false);

  /**
   * Logic that needs to be run after the file has been uploaded to S3
   * @param {string} fileKey - The name of the file in S3
   */
  const handleOnFileProcessed = (fileKey) => {
    setFileKey(fileKey);
  };

  /**
   * Logic that needs to be run after a file has been added to the
   * @param error
   * @param file
   */
  const handleOnFileAdded = (error, file) => {
    if (error === null) {
      setFileObject(file);
    }
  };

  /**
   * Handles the file name changes
   * @param {Object} e - The event object
   */
  const handleFileNameChange = (e) => {
    setFileName(e.target.value);
  };

  /**
   * Handles the file description changes
   * @param {Object} e - The event object
   */
  const handleFileDescriptionChange = (e) => {
    setFileDescription(e.target.value);
  };

  /**
   * Handles the file type changes
   * @param {Object} e - The event object
   */
  const handleFileTypeChange = (e) => {
    setFileType(e.target.value);
  };

  /**
   * Resets all the values in the file upload component
   */
  const clearState = () => {
    setFileName(null);
    setFileType("");
    setFileDescription(null);
    setFileKey(null);
    setFileObject(null);
    setFileReady(false);
  };

  /**
   * Handles the cancel button behavior
   */
  const handleCancel = () => {
    props.handleClickCloseUploadFile();
    clearState();
  };

  /**
   * Handles the file save click
   */
  const handleSaveFile = () => {
    const fileBundle = {
      name: fileName,
      type: fileType,
      description: fileDescription,
      key: fileKey,
      file: fileObject,
    };

    // If there is a click save file handler, call it...
    if (props?.handleClickSaveFile) {
      props.handleClickSaveFile(fileBundle);
      clearState();
    }
  };

  /**
   * Checks if the field is a string and returns it's length
   * @param {any} value - The value in question
   * @return {number}
   */
  const fieldLength = (value) => {
    if (value !== null && typeof value === "string") {
      return value.length;
    }

    return 0;
  };

  /**
   * This side effect checks if the save button should be disabled.
   * This is done by checking the state every time there is a
   * change in the field name, file type, description, file object, and
   * file key state.
   */
  useEffect(() => {
    // Determine if the file is ready to be saved to DB
    const saveDisabled =
      fieldLength(fileName) === 0 ||
      !Number.isInteger(fileType) ||
      fieldLength(fileKey) === 0 ||
      fileObject === null;

    // If no longer disabled, but marked as not ready
    if (saveDisabled === false && fileReady === false) {
      // Mark it as ready
      setFileReady(true);
    }

    if (saveDisabled && fileReady) {
      setFileReady(false);
    }
  }, [fileName, fileType, fileDescription, fileKey, fileObject, fileReady]);

  return (
    <Dialog
      open={props.dialogOpen}
      onClose={props.handleClickCloseUploadFile}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {props?.title ? props.title : "Upload Media"}
      </DialogTitle>
      <DialogContent>
        <Grid container>
          <Grid item xs={12} md={12}>
            <TextField
              autoFocus
              className={classes.textField}
              id="standard-multiline-flexible"
              placeholder={"File name"}
              multiline={false}
              value={null}
              onChange={handleFileNameChange}
              fullWidth
            />

            <FormControl>
              <InputLabel>Type</InputLabel>
              <Select
                className={classes.selectField}
                value={fileType}
                label="Type"
                onChange={handleFileTypeChange}
              >
                <MenuItem
                  value={1}
                  className={classes.inputFieldAdornmentColor}
                >
                  Funding
                </MenuItem>
                <MenuItem
                  value={2}
                  className={classes.inputFieldAdornmentColor}
                >
                  Plans
                </MenuItem>
                <MenuItem
                  value={3}
                  className={classes.inputFieldAdornmentColor}
                >
                  Estimates
                </MenuItem>
                <MenuItem
                  value={4}
                  className={classes.inputFieldAdornmentColor}
                >
                  Other
                </MenuItem>
              </Select>
            </FormControl>

            <TextField
              className={classes.textField}
              id="standard-multiline-static"
              placeholder={"Description"}
              multiline
              rows={4}
              defaultValue={null}
              onChange={handleFileDescriptionChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={12} className={classes.fileUpload}>
            <FileUpload
              limit={1}
              sizeLimit={"1024MB"}
              principal={"project"}
              projectId={props.projectId}
              onFileProcessed={handleOnFileProcessed}
              onFileAdded={handleOnFileAdded}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleSaveFile}
          color="primary"
          variant="contained"
          startIcon={<Icon>save</Icon>}
          disabled={!fileReady}
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FileUploadDialogSingle;
