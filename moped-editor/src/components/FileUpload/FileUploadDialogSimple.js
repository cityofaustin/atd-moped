import React, { useEffect, useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Icon,
} from "@material-ui/core";
import FileUpload from "./FileUpload";

import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
    fileUpload: {
      minWidth: "320px",
    },
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

const FileUploadDialogSimple = props => {
    const classes = useStyles();

    /**
     * @constant {string} fileName - Contains a human-readable file name
     * @constant {string} fileDescription - Contains a human-readable file description
     * @constant {string} fileKey - The location of the file in S3
     * @constant {Object} fileObject - Contains the file object, including metadata.
     * @constant {bool} fileReady - True if we have everything we need to commit the file to the DB
     */
    const [fileKey, setFileKey] = useState(null);
    const [fileObject, setFileObject] = useState(null);
    const [fileReady, setFileReady] = useState(false);

    /**
     * Logic that needs to be run after the file has been uploaded to S3
     * @param {string} fileKey - The name of the file in S3
     */
    const handleOnFileProcessed = fileKey => {
        setFileKey(fileKey);
    };

    /**
     * Resets all the values in the file upload component
     */
    const clearState = () => {
        setFileKey(null);
        setFileObject(null);
        setFileReady(false);
    }

    /**
     * Handles the cancel button behavior
     */
    const handleCancel = () => {
        props.handleClickCloseUploadFile();
        clearState();
    }

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
     * Handles the file save click
     */
    const handleSaveFile = () => {
        const fileBundle = {
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
    const fieldLength = value => {
        if (value !== null && typeof value === "string") {
            return value.length;
        }

        return 0;
    };

    /**
     * This side effect checks if the save button should be disabled.
     * This is done by checking the state every time there is a
     * change in the field name, description, file object, and
     * file key state.
     */
    useEffect(() => {
        // Determine if the file is ready to be saved to DB
        const saveDisabled =
            fieldLength(fileKey) === 0 ||
            fileObject === null;

        // If no longer disabled, but marked as not ready
        if (saveDisabled === false && fileReady === false) {
            // Mark it as ready
            setFileReady(true);
        }

        if(saveDisabled && fileReady) {
            setFileReady(false);
        }
    }, [fileKey, fileObject, fileReady]);


    return (
      <Dialog
        className={classes.dialog}
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
            <Grid xs={12} md={12} className={classes.fileUpload}>
              <FileUpload
                limit={1}
                sizeLimit={"1024MB"}
                principal={props?.principal ?? "user"}
                projectId={props?.projectId ?? null}
                uploadType={"private"}
                onFileProcessed={handleOnFileProcessed}
                onFileAdded={handleOnFileAdded}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancel}
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
            disabled={!fileReady}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
};

export default FileUploadDialogSimple;
