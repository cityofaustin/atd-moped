import React, { useState, useMemo } from "react";
import { useMutation } from "@apollo/client";

import { Box, Divider, IconButton, Typography, Stack } from "@mui/material";
import {
  CREATE_FILE_ECAPRIS_FUNDING_ATTACHMENT,
  DELETE_FILE_ECAPRIS_FUNDING_ATTACHMENT,
  CREATE_FILE_MOPED_FUNDING_ATTACHMENT,
  DELETE_FILE_MOPED_FUNDING_ATTACHMENT,
} from "src/queries/project";

import FileUploadDialogSingle from "src/components/FileUpload/FileUploadDialogSingle";
import DeleteConfirmationModal from "src/views/projects/projectView/DeleteConfirmationModal";
import { LinkOff } from "@mui/icons-material";
import ProjectFileLink from "src/views/projects/projectView/ProjectFiles/ProjectFileLink";

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
const ProjectFundingFilesAttachmentDialog = ({
  projectId,
  fileAttachmentId,
  handleSnackbar,
  isFileAttachmentDialogOpen,
  onClose,
  refetch,
  dataLookups,
  rows,
}) => {
  const fundingRecord = rows.find((row) => row.id === fileAttachmentId); // should i memoize this
  console.log(fundingRecord);
  const isSyncedFromECapris = fundingRecord.is_synced_from_ecapris;
  const [addFundingFileAttachment] = useMutation(
    isSyncedFromECapris
      ? CREATE_FILE_ECAPRIS_FUNDING_ATTACHMENT
      : CREATE_FILE_MOPED_FUNDING_ATTACHMENT
  );
  const [detachFundingFileAttachment] = useMutation(
    isSyncedFromECapris
      ? DELETE_FILE_ECAPRIS_FUNDING_ATTACHMENT
      : DELETE_FILE_MOPED_FUNDING_ATTACHMENT
  );
  const [detachConfirmationFileId, setDetachConfirmationFileId] =
    useState(null);

  const filesAttachedToId = useMemo(() => {
    const filesAttachedToId = rows
      .find((row) => row.id === fileAttachmentId)
      ?.ecapris_funding_files.map(
        (file_record) => file_record.moped_project_file
      );

    return filesAttachedToId ? filesAttachedToId : [];
  }, [fileAttachmentId, rows]);

  const handleClickSaveFile = (fileDataBundle) => {
    const entityId = fundingRecord?.proj_funding_id;
    console.log(entityId);
    const fileConnectionData = isSyncedFromECapris
      ? {
          files_ecapris_fundings: {
            data: {
              project_id: projectId,
              entity_id: entityId,
            },
          },
        }
      : {
          files_project_fundings: {
            data: {
              entity_id: entityId,
            },
          },
        };

    addFundingFileAttachment({
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

  const handleUnlinkFileAttachment = (id) => {
    const fundingRecord = rows.find((row) => row.id === fileAttachmentId);
    const entityId = fundingRecord?.proj_funding_id;

    detachFundingFileAttachment({
      variables: {
        fileId: id,
        entityId,
        projectId,
      },
    })
      .then(() => {
        setDetachConfirmationFileId(null);
        onClose();
        handleSnackbar(true, "File attachment detached", "success");
      })
      .catch((error) => {
        setDetachConfirmationFileId(null);
        handleSnackbar(true, "Error detaching file attachment", "error", error);
      })
      .finally(() => {
        refetch();
      });
  };

  return (
    <FileUploadDialogSingle
      title={"Attach file"}
      dialogOpen={isFileAttachmentDialogOpen}
      handleClickCloseUploadFile={onClose}
      handleClickSaveFile={handleClickSaveFile}
      projectId={projectId}
      fileTypesLookup={dataLookups?.moped_file_types ?? []}
    >
      <Box>
        <Divider sx={{ marginY: 4 }} />
        <Stack direction="column">
          <Typography variant="h4" sx={{ mb: 1 }}>
            Attached files
          </Typography>

          {filesAttachedToId.length > 0 ? (
            filesAttachedToId.map((file) => {
              if (!file) return null;

              return (
                <React.Fragment key={file.project_file_id}>
                  <DeleteConfirmationModal
                    type="file attachment"
                    actionButtonText="Detach"
                    additionalConfirmationText="This will not delete the file, only detach it from this funding record."
                    actionButtonIcon={<LinkOff />}
                    submitDelete={() =>
                      handleUnlinkFileAttachment(file.project_file_id)
                    }
                    isDeleteConfirmationOpen={
                      detachConfirmationFileId === file.project_file_id
                    }
                    setIsDeleteConfirmationOpen={(open) =>
                      setDetachConfirmationFileId(
                        open ? file.project_file_id : null
                      )
                    }
                  />
                  <Stack
                    direction="row"
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    spacing={0.5}
                  >
                    <Box>
                      <IconButton
                        onClick={() =>
                          setDetachConfirmationFileId(file.project_file_id)
                        }
                        size="small"
                      >
                        <LinkOff />
                      </IconButton>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <ProjectFileLink
                        fileKey={file?.file_key}
                        fileUrl={file?.file_url}
                        fileName={file?.file_name}
                      />
                    </Box>
                  </Stack>
                </React.Fragment>
              );
            })
          ) : (
            <Typography variant="body2">No files attached</Typography>
          )}
        </Stack>
      </Box>
    </FileUploadDialogSingle>
  );
};

export default ProjectFundingFilesAttachmentDialog;
