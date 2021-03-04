import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Icon,
  InputAdornment,
  TextField,
} from "@material-ui/core";
import FileUpload from "./FileUpload";

import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
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
  textFieldAdornment: {
    position: "relative",
    top: "-1.6rem",
  },
  textFieldAdornmentColor: {
    color: "grey",
  },
}));

const FileUploadDialogSingle = props => {
  const classes = useStyles();

  const [fileName, setFileName] = useState(null);
  const [fileDescription, setFileDescription] = useState(null);
  const [fileKey, setFileKey] = useState(null);
  const [fileObject, setFileObject] = useState(null);

  const handleOnFileProcessed = (fileKey, fileObject) => {
    console.log("handleOnFileUploaded(): fileKey: ", fileKey);
    console.log("handleOnFileUploaded(): fileObject: ", fileObject);
    setFileKey(fileKey);
    setFileObject(fileObject);
  };

  const handleOnFileAdded = (error, file) => {
    if(error === null) {
        setFileObject(file);
    }
  };

  const handleFileNameChange = e => {
    setFileName(e.target.value);
  };

  const handleFileDescriptionChange = e => {
    setFileDescription(e.target.value);
  };

  const handleSaveFile = () => {
    const fileBundle = {
      name: fileName,
      description: fileDescription,
      key: fileKey,
      file: fileObject,
    };

    console.log("Saving: ", fileBundle);

    if (props?.handleClickSaveFile) {
      console.log("Calling handler");
      props.handleClickSaveFile(fileBundle);
    } else {
      console.error("There is no save file handler!");
    }

    if (props?.handleClickCloseUploadFile) {
      props.handleClickCloseUploadFile();
    }
  };

  useEffect(() => {
    if (fileName) {
      console.log("fileName: ", fileName);
    }
  }, [fileName]);

  useEffect(() => {
    if (fileDescription) {
      console.log("fileDescription: ", fileDescription);
    }
  }, [fileDescription]);

  useEffect(() => {
    if (fileKey) {
      console.log("fileKey:", fileKey);
    }
  }, [fileKey]);

  useEffect(() => {
    if (fileObject) {
      console.log("fileObject:", fileObject);
    }
  }, [fileObject]);

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
          <Grid md={12}>
            <TextField
              className={classes.textField}
              id="standard-multiline-flexible"
              placeholder={"File Title"}
              // multiline
              // rowsMax={4}
              value={null}
              onChange={handleFileNameChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start"
                    className={classes.textFieldAdornmentColor}
                  >
                    <Icon>info</Icon>
                  </InputAdornment>
                ),
              }}
              fullWidth
            />
            <TextField
              className={classes.textField}
              id="standard-multiline-static"
              placeholder={"File Description"}
              multiline
              rows={4}
              defaultValue={null}
              onChange={handleFileDescriptionChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start"
                    className={`${classes.textFieldAdornment} ${classes.textFieldAdornmentColor}`}
                  >
                    <Icon>textsms</Icon>
                  </InputAdornment>
                ),
              }}
              fullWidth
            />
          </Grid>
          <Grid md={12} className={classes.fileUpload}>
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
        <Button
          onClick={props.handleClickCloseUploadFile}
          color="primary"
          autoFocus
        >
          Cancel
        </Button>
        <Button
          onClick={handleSaveFile}
          color="primary"
          variant="contained"
          startIcon={<Icon>save</Icon>}
          disabled={props?.saveDisabled ?? true}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FileUploadDialogSingle;
