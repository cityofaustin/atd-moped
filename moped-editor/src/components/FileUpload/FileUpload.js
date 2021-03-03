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

  const parseSignatureResponse = res => {
    let responseFileList = [];
    responseFileList.push(res);

    let value = false;

    try {
      value = this.fileList.length
          ? JSON.stringify(this.fileList.map(f => `${f.creds.fields.key}`))
          : false;
    } catch (error) {
      console.error("parseSignatureResponse() Error: ");
      console.error(error);
      value = false;
    }

    props.onChange(value);

    setFileList(responseFileList);
  };

  const withQuery = (url, params) => {
    const query = Object.keys(params)
        .filter(k => params[k] !== undefined)
        .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
        .join("&");
    url += (url.indexOf("?") === -1 ? "?" : "&") + query;
    return url;
  };

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
