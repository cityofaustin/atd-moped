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

  return (
    <span>
      Hello World!
    </span>
  );
};

export default FileUpload;
