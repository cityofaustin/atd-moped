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

  return (
    <span>
      Hello World!
    </span>
  );
};

export default FileUpload;
