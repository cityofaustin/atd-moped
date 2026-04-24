import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid2,
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

/**
 * Wrapper component for uploading a single file to S3 and saving the file metadata to the database
 * @param {string} title - title of the dialog
 * @param {boolean} dialogOpen - boolean that controls whether the dialog is open or not
 * @param {function} handleClickCloseUploadFile - handles closing the file upload dialog and other actions
 * @param {function} handleClickSaveFile - handles saving the file to the database and receives a file bundle object with the following shape:
 * {
 *   name: string,
 *   type: number,
 *   description: string,
 *   key: string,
 *   file: file object as returned by the file uploader,
 *   url: string (external file link, if applicable)
 * }
 * @param {number} projectId - integer representing the project id. This is used to generate the S3 presigned URL for file upload
 * @param {Object[]} fileTypesLookup - array of file types lookup options
 * @param {Object} children - React children elements
 * @returns {JSX.Element}
 */
const FileUploadDialogSingle = ({
  title,
  dialogOpen,
  handleClickCloseUploadFile,
  handleClickSaveFile,
  projectId,
  fileTypesLookup,
  children,
}) => {
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
        <Grid2 container style={{ marginTop: "5px" }}>
          <Grid2
            size={{
              xs: 12,
              md: 12,
            }}
          >
            <TextField
              autoFocus
              sx={(theme) => ({
                marginTop: theme.spacing(2),
                marginBottom: theme.spacing(2),
              })}
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
                sx={(theme) => ({ width: theme.spacing(25) })}
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
              sx={(theme) => ({
                marginTop: theme.spacing(2),
                marginBottom: theme.spacing(2),
              })}
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
          </Grid2>
          <Grid2
            sx={(theme) => ({ marginTop: theme.spacing(2) })}
            size={{
              xs: 12,
              md: 12,
            }}
          >
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
          </Grid2>
        </Grid2>
        {children}
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
