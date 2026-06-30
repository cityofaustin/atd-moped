import React, { useState, useMemo } from "react";
import { useMutation } from "@apollo/client";
import { Box, Tabs, Tab } from "@mui/material";

import FileUploadSingle from "src/components/FileUpload/FileUploadSingle";
import FormDialog from "src/components/FormDialog";
import { useFileUploadForm } from "src/components/FileUpload/useFileUploadForm";
import AttachExistingFileTable from "src/views/projects/projectView/ProjectFunding/AttachExistingFileTable"; //*

function AttachmentTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      aria-hidden={value !== index}
      id={`attachment-tabpanel-${index}`}
      aria-labelledby={`attachment-tab-${index}`}
      // Keep inactive tab content mounted but hidden with CSS rather than the
      // `hidden` attribute to avoid UI shift on tab selection and prevent
      // 0px measurement warning by the DataGridPro table inside.
      style={{
        position: value === index ? "static" : "absolute",
        visibility: value === index ? "visible" : "hidden",
        display: value === index ? "block" : "none",
        width: "100%",
      }}
      {...other}
    >
      {<Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `attachment-tab-${index}`,
    "aria-controls": `attachment-tabpanel-${index}`,
  };
}

/**
 * Dialog for attaching files to project funding record and detaching existing attachments
 * @param {number} projectId - ID of the project to which the funding record (and thus file attachment) belongs
 * @param {number} fileAttachmentId - ID of the funding record to which files are being attached/detached
 * @param {function} handleSnackbar - Snackbar handler function for user feedback on success/failure of attaching/detaching files
 * @param {boolean} isFileAttachmentDialogOpen - Boolean state for whether the dialog is open
 * @param {function} onClose - Fires when closing this dialog
 * @param {function} refetch - Refetch project funding data after attaching/detaching files
 * @param {Array} dataLookups - Lookup data for file types
 * @param {Array} rows - Array of project funding records, used to determine which files are currently attached to the given funding record (fileAttachmentId)
 * @returns {JSX.Element}
 */
const ProjectFilesAttachmentDialog = ({
  projectId,
  fileAttachmentId,
  handleSnackbar,
  isFileAttachmentDialogOpen,
  onClose,
  refetch,
  dataLookups,
  rows,
  addFileMutation,
  existingFileMutation,
  filesType,
  fileConnectionData,
}) => {
  const [addFileAttachment, { loading: addFileLoading }] =
    useMutation(addFileMutation);
  const [attachExistingFile, { loading: attachFileLoading }] =
    useMutation(existingFileMutation);

  const isLoading = addFileLoading || attachFileLoading;

  const filesAttachedToId = useMemo(() => {
    const filesAttachedToId = rows.find((row) => row.id === fileAttachmentId)?.[
      filesType
    ];

    return filesAttachedToId ? filesAttachedToId : [];
  }, [fileAttachmentId, rows, filesType]);

  /* File upload form state and handlers */
  const handleClickSaveFile = (fileDataBundle) => {
    addFileAttachment({
      variables: {
        object: {
          project_id: projectId,
          file_name: fileDataBundle?.name,
          file_type: fileDataBundle?.type,
          file_description: fileDataBundle?.description,
          file_key: fileDataBundle?.key,
          file_size: fileDataBundle?.file?.fileSize ?? 0,
          file_url: fileDataBundle?.url,
          ...fileConnectionData,
        },
      },
    })
      .then(() => {
        onClose();
        handleSnackbar(true, "File attachment linked", "success");
      })
      .catch((error) => {
        handleSnackbar(true, "Error linking file attachment", "error", error);
      })
      .finally(() => {
        refetch();
      });
  };

  const { fileReady, buildFileBundle, clearState, ...formProps } =
    useFileUploadForm();

  const handleSave = () => {
    const fileBundle = buildFileBundle();
    handleClickSaveFile(fileBundle);
    clearState();
  };

  const handleCancel = () => {
    clearState();
    onClose();
  };

  /* Tabs state and handlers */
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (_, newValue) => {
    setTabValue(newValue);
  };

  /* Existing file attachment tab state and handlers */
  const [existingFileIdToAttach, setExistingFileIdToAttach] = useState("");
  const handleRowSelection = (newSelection) => {
    setExistingFileIdToAttach([...newSelection.ids][0]);
  };

  const handleAttach = () => {
    attachExistingFile({
      variables: {
        object: {
          file_id: existingFileIdToAttach,
          entity_id: fundingRecord?.proj_funding_id,
          is_deleted: false,
          ...(isSyncedFromECapris && { project_id: projectId }),
        },
      },
    })
      .then(() => {
        setExistingFileIdToAttach("");
        onClose();
        handleSnackbar(true, "File attached", "success");
      })
      .catch((error) => {
        setExistingFileIdToAttach("");
        handleSnackbar(true, "Error attaching file", "error", error);
      })
      .finally(() => {
        refetch();
      });
  };

  const newFileLabel = formProps.externalFile
    ? "Save and attach"
    : "Upload and attach";
  const isExistingFileTab = tabValue === 1;

  return (
    <FormDialog
      title="Attach files"
      open={isFileAttachmentDialogOpen}
      handleClose={onClose}
      handleSave={isExistingFileTab ? handleAttach : handleSave}
      handleCancel={handleCancel}
      saveDisabled={
        isLoading || (isExistingFileTab ? !existingFileIdToAttach : !fileReady)
      }
      saveButtonLabel={isExistingFileTab ? "Attach" : newFileLabel}
      showDialogActions={true}
      dialogProps={{ maxWidth: "md" }}
    >
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleChange}
            aria-label="add new or existing file attachment tabs"
          >
            <Tab label="New" {...a11yProps(0)} />
            <Tab label="Existing" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <AttachmentTabPanel value={tabValue} index={0}>
          <FileUploadSingle
            projectId={projectId}
            fileTypesLookup={dataLookups?.moped_file_types ?? []}
            {...formProps}
          />
        </AttachmentTabPanel>
        <AttachmentTabPanel value={tabValue} index={1}>
          <AttachExistingFileTable
            projectId={projectId}
            handleRowSelection={handleRowSelection}
            attachedFiles={filesAttachedToId}
          />
        </AttachmentTabPanel>
      </Box>
    </FormDialog>
  );
};

export default ProjectFilesAttachmentDialog;
