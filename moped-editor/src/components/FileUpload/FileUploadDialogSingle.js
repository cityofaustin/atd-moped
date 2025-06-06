import React, { useState } from "react";
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
  FormControlLabel,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  Switch,
} from "@mui/material";
import FileUpload from "src/components/FileUpload/FileUpload";

import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles(() => ({
  textField: {
    marginTop: "1rem",
    marginBottom: "1rem",
  },
  selectField: {
    width: "200px",
  },
  fileUpload: {
    marginTop: "1rem",
  },
}));

const FileUploadDialogSingle = ({
  title,
  dialogOpen,
  handleClickCloseUploadFile,
  handleClickSaveFile,
  projectId,
  fileTypesLookup,
}) => {
  const classes = useStyles();

  /**
   * @constant {string} fileName - Contains a human-readable file name
   * @constant {string} fileType- Contains an integer representing file type
   * @constant {string} fileDescription - Contains a human-readable file description
   * @constant {string} fileKey - The location of the file in S3
   * @constant {Object} fileObject - Contains the file object, including metadata.
   * @constant {bool} fileReady - True if we have everything we need to commit the file to the DB
   * @constant {bool} externalFile - True if user toggled external file switch
   * @constant {string} externalFileLink - external file location string
   */
  const [fileName, setFileName] = useState(null);
  const [fileType, setFileType] = useState("");
  const [fileDescription, setFileDescription] = useState(null);
  const [fileKey, setFileKey] = useState(null);
  const [fileObject, setFileObject] = useState(null);
  const [externalFile, setExternalFile] = useState(false);
  const [externalFileLink, setExternalFileLink] = useState(null);

  /**
   * Logic that needs to be run after the file has been uploaded to S3
   * @param {string} fileKey - The name of the file in S3
   */
  const handleOnFileProcessed = (fileKey) => {
    setFileKey(fileKey);
  };

  /**
   * Logic that needs to be run after a file has been added to the uploader
   * @param error
   * @param file
   */
  const handleOnFileAdded = (error, file) => {
    if (error === null) {
      setFileObject(file);
    }
  };

  const handleFileNameChange = (e) => {
    setFileName(e.target.value.trim());
  };

  const handleFileDescriptionChange = (e) => {
    setFileDescription(e.target.value.trim());
  };

  const handleFileTypeChange = (e) => {
    setFileType(e.target.value);
  };

  const handleExternalLinkChange = (e) => {
    setExternalFileLink(e.target.value.trim());
  };

  const handleToggleChange = (e) => {
    const toggleChecked = e.target.checked;
    setExternalFile(toggleChecked);
    if (!toggleChecked) {
      setExternalFileLink(null);
    }
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
    setExternalFile(false);
    setExternalFileLink(null);
  };

  const handleCancel = () => {
    handleClickCloseUploadFile();
    clearState();
  };

  /**
   * Handles the file save click
   */
  const handleSaveFile = () => {
    const fileBundle = {
      name: fileName || null,
      type: fileType,
      description: fileDescription || null,
      key: fileKey,
      file: fileObject,
      url: externalFileLink || null,
    };

    // If there is a click save file handler, call it...
    if (handleClickSaveFile) {
      handleClickSaveFile(fileBundle);
      clearState();
    }
  };

  /**
   * Checks if the field is a string and returns it's length
   * @param {any} value - The value in question
   * @return {number} field length or 0 if field is null or not a string
   */
  const fieldLength = (value) => {
    if (value !== null && typeof value === "string") {
      return value.length;
    }

    return 0;
  };

  const fileReady = externalFile
    ? fieldLength(fileName) > 0 &&
      Number.isInteger(fileType) &&
      fieldLength(externalFileLink) > 0
    : fieldLength(fileName) > 0 &&
      Number.isInteger(fileType) &&
      fieldLength(fileKey) > 0 &&
      fileObject != null;

  return (
    <Dialog
      open={dialogOpen}
      onClose={handleClickCloseUploadFile}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle variant="h4">{title ? title : "Upload Media"}</DialogTitle>
      <DialogContent>
        <Grid container style={{ marginTop: "5px" }}>
          <Grid item xs={12} md={12}>
            <TextField
              autoFocus
              className={classes.textField}
              id="file-name-input"
              multiline={false}
              label={"File name"}
              value={undefined}
              onChange={handleFileNameChange}
              fullWidth
              helperText={"Required"}
            />

            <FormControl>
              <InputLabel id="select-dropdown-filetype">Type</InputLabel>
              <Select
                labelId="select-dropdown-filetype"
                className={classes.selectField}
                value={fileType}
                label="Type"
                onChange={handleFileTypeChange}
              >
                {fileTypesLookup.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Required</FormHelperText>
            </FormControl>

            <TextField
              className={classes.textField}
              id="standard-multiline-static"
              label={"Description"}
              multiline
              rows={4}
              defaultValue={null}
              onChange={handleFileDescriptionChange}
              fullWidth
            />

            <FormControl>
              <FormControlLabel
                value="external"
                control={
                  <Switch
                    color="primary"
                    checked={externalFile}
                    onChange={handleToggleChange}
                  />
                }
                label="Link to file"
                labelPlacement="start"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={12} className={classes.fileUpload}>
            {externalFile ? (
              <TextField
                autoFocus
                id="file-name-input"
                multiline={false}
                label={"Link"}
                value={undefined}
                onChange={handleExternalLinkChange}
                fullWidth
                helperText={"Required. Enter URL or network location"}
              />
            ) : (
              <FileUpload
                limit={1}
                sizeLimit={"1024MB"}
                projectId={projectId}
                onFileProcessed={handleOnFileProcessed}
                onFileAdded={handleOnFileAdded}
              />
            )}
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
          {externalFile ? "Save" : "Upload"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FileUploadDialogSingle;
