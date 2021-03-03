import React, { useState } from "react";

import { v4 as uuid } from "uuid";
import crypto from "crypto";

import config from "../../config";

import { FilePond, File, registerPlugin } from "react-filepond";

import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";

// Import FilePond styles
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize
);

const FileUpload = props => {
  const uniqueIdentifier = crypto.createHmac("sha256", uuid()).digest("hex");

  const [files, setFiles] = useState([]);

  const [fileList, setFileList] = useState([]);

  const handleInit = () => {
    console.log("FilePond instance has initialised.");
  };

  /**
   * Parses a signature request response
   * @param {Object} res - The response as provided by the API
   */
  const parseSignatureResponse = res => {
    let responseFileList = [];
    responseFileList.push(res);

    let value = false;

    try {
      value = fileList.length
        ? JSON.stringify(fileList.map(f => `${f.creds.fields.key}`))
        : false;
    } catch (error) {
      console.error("parseSignatureResponse() Error: ");
      console.error(error);
      value = false;
    }

    props.onChange(value);

    setFileList(responseFileList);
  };

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
   * Retrieves a file signature request from API
   * @param {string} key - The name of the file
   * @param {string} uniqueIdentifier - A random unique identifier
   */
  const retrieveFileSignature = (key, uniqueIdentifier) => {
    const formData = new FormData();

    formData.append("key", key);
    formData.append("uniqueid", uniqueIdentifier);

    fetch(
      withQuery(`${config.env.APP_API_ENDPOINT}/uploads/request-signature`, {
        file: key,
        uniqueid: uniqueIdentifier.toLowerCase(),
      })
    )
      .then(res => res.json())
      .catch(error => console.error("Error:", error))
      .then(res => {
        parseSignatureResponse(res);
      });
  };

  /**
   * Handles a file added event
   * @param {Object} error - The error object
   * @param {Object} file - The file object with attributes
   */
  const handleFileAdded = (error, file) => {
    retrieveFileSignature(file.filename, uniqueIdentifier);
  };

  /**
   * Handles file removal events
   * @param {string} file - The name of the file
   */
  const handleRemoveFile = file => {
    let newFileList = [...fileList];
    for (const i in newFileList) {
      const currentFile = newFileList[i];
      if (currentFile.filename === file.filename) {
        // console.log(`Removing: ${file.filename} at index: ${i}`);
        newFileList.splice(i, 1);
        setFileList(newFileList);
      }
    }
  };

  /**
   * Retrieves a file signature from a list
   * @param {string} file - The name of the file
   * @return {string|null}
   */
  const getFileSignatureFromList = file => {
    const uploadedFileName = file.name || "";

    for (const i in fileList) {
      const currentFile = fileList[i];
      if (currentFile.filename === uploadedFileName) {
        // console.log(`getFileSignatureFromList() Item found at index: ${i}`);
        const creds = fileList[i].creds;
        return creds;
      }
    }
    // If not found, return null
    return null;
  };

  /**
   * Handles file update event
   * @param {object} fileItems
   */
  const filesUpdated = ({ fileItems }) => {
    // Set current file objects to this.state
    setFiles(fileItems.map(fileItem => fileItem.file));
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

    // First, find the S3 signature data from this.state.fileList

    const fileSignature = getFileSignatureFromList(file);
    let fields = [];

    if (fileSignature == null) {
      console.log("The file signature for file could not be located.");
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
      <header>
        {/* // Then we need to pass FilePond properties as attributes */}
        <FilePond
          allowMultiple
          allowFileSizeValidation
          labelIdle='Drag & drop your files or <span class="filepond--label-action"> browse </span>'
          maxFiles={100}
          maxFileSize="20000MB"
          /* FilePond allows a custom process to handle uploads */
          server={{
            process: handleProcessing,
          }}
          oninit={() => handleInit()}
          /* OnAddFile we are going to request a token for that file, and update a dictionary with the tokens */
          onaddfile={(error, file) => handleFileAdded(error, file)}
          /* OnRemoveFile we are going to find the file in the list and splice it (remove it) */
          onremovefile={file => handleRemoveFile(file)}
          onupdatefiles={fileItems => filesUpdated({ fileItems })}
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
