import React, { useState } from "react";

// Internal functions
import config from "../../config";
import { useUser, getJwt } from "../../auth/user";

// File Pond Library
import { FilePond, registerPlugin } from "react-filepond";
// `File` imported from filepond to workaround react-scripts 5 import error
import { File } from "filepond"
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";

// Import FilePond styles
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { Alert } from "@material-ui/lab";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Grid } from "@material-ui/core";

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize
);

const useStyles = makeStyles(theme => ({
  errorMessage: {
    margin: "1rem 0",
  },
}));

const FileUpload = props => {
  /**
   * Constants
   */
  const classes = useStyles();
  const { user } = useUser();
  const token = getJwt(user);
  const maxFiles = props?.limit ?? 1;

  /**
   * For use of filepond component.
   * @constant {Object[]} files - It holds a list of files and metadata.
   * @function setFiles - For use of filepond only.
   */
  const [files, setFiles] = useState([]);

  /**
   * @constant {Object} - A key value dictionary, where the key
   * is the name of the file, the value are the credentials as
   * provided by S3.
   * @function setFileSignatures
   */
  const [fileSignatures, setFileSignatures] = useState({});

  /**
   * @constant {string[]} - A list of errors as detected anywhere in this component
   * @function setErrors
   */
  const [errors, setErrors] = useState([]);

  /**
   * Generates a URL given a list of parameters. It URI-Encodes the parameters
   * @param {string} url - The base URL
   * @param {string[]} params - A list of parameters
   * @return {string}
   */
  const withQuery = (url, params) => {
    const query = Object.keys(params)
      .filter(k => params[k] !== undefined)
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
      .join("&");
    url += (url.indexOf("?") === -1 ? "?" : "&") + query;
    return url;
  };

  /**
   * This function is triggered before a file is added and processed.
   * It attempts to retrieve permission to upload a file to S3
   * @param {Object} item - The file object as provided by FilePond
   * @return {Promise<boolean>}
   */
  const handleBeforeAdd = item => {
    return fetch(
      withQuery(`${config.env.APP_API_ENDPOINT}/files/request-signature`, {
        file: item.filename,
        ...(props?.projectId ? { project_id: props.projectId } : {}),
        ...(props?.uploadType ? { type: props.uploadType } : {}),
      }),
      {
        headers: {
          "Content-Type": "text/plain;charset=UTF-8",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(
        response => {
          if (response.status !== 200) {
            setErrors([
              `Cannot retrieve file signature for file '${item.filename}'. Please reload your page and try again or contact the Data & Technology Services department. Feedback message: ${response.status} - ${response.statusText}`,
            ]);
            return false;
          } else {
            response
              .json()
              .then(data => {
                setErrors([]);
                if (data?.credentials) {
                  const newFileSignatureState = { ...fileSignatures };
                  newFileSignatureState[item.filename] = data.credentials;
                  setFileSignatures(newFileSignatureState);
                }
              })
              .catch(err => {
                // eslint-disable-next-line
                throw "Error: " + JSON.stringify(err);
              });

            return true;
          }
        },
        rejection => {
          setErrors([
            `Cannot retrieve file signature for file '${item.filename}'. Please reload your page and try again or contact the Data & Technology Services department.`,
          ]);
          console.error(
            "Request Rejected for file: ",
            item.filename,
            rejection
          );
          return false;
        }
      )
      .catch(error => {
        setErrors([
          `Cannot retrieve file signature for file '${item.filename}'. Please reload your page and try again or contact the Data & Technology Services department. Feedback: ${error}`,
        ]);
        return false;
      });
  };

  /**
   * Whenever a file is processed successfully, this function is executed.
   * @param {str} error - String containing the error
   * @param {Object} file - The file object, including metadata.
   */
  const handleFileAdded = (error, file) => {
    if (error) {
      setErrors([
        `Error attempting to add file '${file.filename}'. Please reload your page and try again or contact the Data & Technology Services department. Feedback message: ${errors}`,
      ]);
      return;
    }

    if (props?.onFileAdded) {
      props.onFileAdded(error, file);
    }
  };

  /**
   * Processes a single file upload event
   * @param {string} fieldName - The name of the field
   * @param {string} file - The name of the file
   * @param {Object} metadata - The file metadata
   * @function load - Load function callback
   * @function error - Error function callback
   * @function progress - Progress function callback
   * @function abort - Abort function callback
   * @return {{abort: abort}}
   */
  const handleProcessing = (
    fieldName,
    file,
    metadata,
    load,
    error,
    progress,
    abort
  ) => {
    // fieldName is the name of the input field
    // file is the actual file object to send
    const formData = new FormData();

    // First, retrieve the signature from state that we got from S3
    const fileSignature = fileSignatures[file.name];

    // If the signature is invalid, might as well stop it!
    if (fileSignature == null) {
      // eslint-disable-next-line
      throw "The file signature for file could not be located.";
    }

    // Fields will contain the credentials S3 needs, including the file signature.
    let fields = [];

    try {
      // Copy the name of each of those keys
      fields = Object.keys(fileSignature.fields);
    } catch (error) {
      // eslint-disable-next-line
      throw "Error processing file: " + JSON.stringify(error);
    }

    // For each field, append it to the virtual form data
    for (const key of fields) {
      formData.append(key, fileSignature.fields[key]);
    }
    // Append the file name
    formData.append("file", file, fileSignature.fields.key);

    const request = new XMLHttpRequest();

    request.open("POST", fileSignature.url);

    // Should call the progress method to update the progress to 100% before calling load
    // Setting computable to false switches the loading indicator to infinite mode
    request.upload.onprogress = e => {
      progress(e.lengthComputable, e.loaded, e.total);
    };

    // Should call the load method when done and pass the returned server file id
    // this server file id is then used later on when reverting or restoring a file
    // so your server knows which file to return without exposing that info to the client
    request.onload = function() {
      if (request.status >= 200 && request.status < 300) {
        if (props?.onFileProcessed) {
          props.onFileProcessed(fileSignature.fields.key);
        }
        // the load method accepts either a string (id) or an object
        load(request.responseText);
      } else {
        // Can call the error method if something is wrong, should exit after
        error("oh no");
      }
    };

    request.send(formData);

    // Should expose an abort method so the request can be cancelled
    return {
      abort: () => {
        // This function is entered if the user has tapped the cancel button
        request.abort();

        // Let FilePond know the request has been cancelled
        abort();
      },
    };
  };

  return (
    <Grid fullWidth>
      {errors.length > 0 &&
        errors.map(err => {
          return (
            <Alert className={classes.errorMessage} severity="error">
              <b>Error:</b> {err}
            </Alert>
          );
        })}
      {/* // Then we need to pass FilePond properties as attributes */}
      <FilePond
        allowFileSizeValidation
        labelIdle='Drag & drop your files or <span class="filepond--label-action"> browse </span>'
        maxFiles={maxFiles}
        maxFileSize="1024MB"
        allowMultiple={false}
        /* FilePond allows a custom process to handle uploads */
        server={{
          process: handleProcessing,
        }}
        beforeAddFile={handleBeforeAdd}
        onprocessfile={(error, file) => handleFileAdded(error, file)}
        onupdatefiles={setFiles}
      >
        {/* Update current files  */}
        {files.map(file => (
          <File key={file} src={file} origin="local" />
        ))}
      </FilePond>
    </Grid>
  );
};

export default FileUpload;
