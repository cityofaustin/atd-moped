import { useState } from "react";

/**
 * Checks if the field is a string and returns its length
 * @param {any} value - The value in question
 * @return {number} field length or 0 if field is null or not a string
 */
const fieldLength = (value) => {
  if (value !== null && typeof value === "string") {
    return value.length;
  }
  return 0;
};

/**
 * Hook that manages file upload form state and logic
 * @returns {Object} form state, handlers, fileReady, buildFileBundle, clearState
 */
export const useFileUploadForm = () => {
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

  const fileReady = externalFile
    ? fieldLength(fileName) > 0 &&
      Number.isInteger(fileType) &&
      fieldLength(externalFileLink) > 0
    : fieldLength(fileName) > 0 &&
      Number.isInteger(fileType) &&
      fieldLength(fileKey) > 0 &&
      fileObject != null;

  const buildFileBundle = () => ({
    name: fileName || null,
    type: fileType,
    description: fileDescription || null,
    key: fileKey,
    file: fileObject,
    url: externalFileLink || null,
  });

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
    setExternalFile(e.target.checked);
    if (!e.target.checked) {
      setExternalFileLink(null);
    }
  };

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

  return {
    fileName,
    fileType,
    fileDescription,
    fileKey,
    fileObject,
    externalFile,
    externalFileLink,
    fileReady,
    buildFileBundle,
    clearState,
    handleFileNameChange,
    handleFileDescriptionChange,
    handleFileTypeChange,
    handleExternalLinkChange,
    handleToggleChange,
    handleOnFileProcessed,
    handleOnFileAdded,
  };
};
