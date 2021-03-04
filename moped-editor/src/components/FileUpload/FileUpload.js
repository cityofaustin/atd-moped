import React, { useState } from "react";

// Internal functions
import config from "../../config";
import { useUser, getJwt } from "../../auth/user";

// File Pond Library
import { FilePond, File, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";

// Import FilePond styles
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { Alert } from "@material-ui/lab";
import makeStyles from "@material-ui/core/styles/makeStyles";

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
  const classes = useStyles();

  const [files, setFiles] = useState([]);

  const [fileSignatures, setFileSignatures] = useState({});

  const [errors, setErrors] = useState([]);

  const { user } = useUser();
  const token = getJwt(user);

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
        ...(props?.projectId ? { projectId: props.projectId } : {}),
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
                  console.log("Request Resolved for file: ", item.filename);
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
          console.error("Request Rejected for file: ", item.filename, rejection);
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

    // First, retrieve the signature from S3
    const fileSignature = fileSignatures[file.name];

    // const fileSignature = getFileSignatureFromList(file);
    let fields = [];

    if (fileSignature == null) {
      throw "The file signature for file could not be located.";
    }

    try {
      fields = Object.keys(fileSignature.fields);
    } catch (error) {
      fields = [];
      console.log("Error: ");
      console.log(error);
    }

    for (const key of fields) {
      formData.append(key, fileSignature.fields[key]);
    }

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
    <div>
      {errors.length > 0 &&
        errors.map(err => {
          return (
            <Alert className={classes.errorMessage} severity="error">
              <b>Error:</b> {err}
            </Alert>
          );
        })}
      <header>
        {/* // Then we need to pass FilePond properties as attributes */}
        <FilePond
          allowFileSizeValidation
          labelIdle='Drag & drop your files or <span class="filepond--label-action"> browse </span>'
          maxFiles={1}
          maxFileSize="1024MB"
          allowMultiple={false}
          /* FilePond allows a custom process to handle uploads */
          server={{
            process: handleProcessing,
          }}
          beforeAddFile={handleBeforeAdd}
          onupdatefiles={setFiles}
        >
          {/* Update current files  */}
          {files.map(file => (
            <File key={file} src={file} origin="local" />
          ))}
        </FilePond>
      </header>
    </div>
  );
};

export default FileUpload;
