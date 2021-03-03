import React, { useState } from "react";

import { v4 as uuid } from "uuid";
import crypto from "crypto";

import config from "../../config";

import { FilePond, File, registerPlugin } from "react-filepond";

import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize
);

const FileUpload = props => {
  const uniqueId = crypto.createHmac("sha256", uuid()).digest("hex");

  const [uniqueIdentifier, setUniqueIdentifier] = useState(uniqueId);

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
  }
  
  const handleRemoveFile = (file) => {
    let newFileList = [...fileList];
    for (const i in newFileList) {
      const currentFile = newFileList[i];
      if (currentFile.filename === file.filename) {
        // console.log(`Removing: ${file.filename} at index: ${i}`);
        newFileList.splice(i, 1);
        setFileList(newFileList);
      }
    }
  }

  const getFileSignatureFromList = (file) => {
    const uploadedFileName = file.name || '';

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
  }

  const filesUpdated = ({ fileItems }) => {
    // Set current file objects to this.state
    setFiles(fileItems.map(fileItem => fileItem.file));
  }

  return (
    <span>
      Hello World!
    </span>
  );
};

export default FileUpload;
