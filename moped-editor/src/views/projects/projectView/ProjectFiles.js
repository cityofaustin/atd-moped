import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import isEqual from "lodash/isEqual";

import { CardContent, CircularProgress, Link, Typography } from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";
import {
  DataGridPro,
  GridRowModes,
  useGridApiRef,
  gridStringOrNumberComparator,
} from "@mui/x-data-grid-pro";
import dataGridProStyleOverrides from "src/styles/dataGridProStylesOverrides";
import { useMutation, useQuery } from "@apollo/client";

import humanReadableFileSize from "../../../utils/humanReadableFileSize";
import ApolloErrorHandler from "../../../components/ApolloErrorHandler";
import ExternalLink from "../../../components/ExternalLink";
import FileUploadDialogSingle from "../../../components/FileUpload/FileUploadDialogSingle";
import {
  PROJECT_FILE_ATTACHMENTS,
  PROJECT_FILE_ATTACHMENTS_DELETE,
  PROJECT_FILE_ATTACHMENTS_UPDATE,
  PROJECT_FILE_ATTACHMENTS_CREATE,
} from "../../../queries/project";
import { getJwt, useUser } from "../../../auth/user";
import downloadFileAttachment from "../../../utils/downloadFileAttachment";
import { FormattedDateString } from "src/utils/dateAndTime";
import { isValidUrl } from "src/utils/urls";
import ProjectFilesToolbar from "./ProjectFilesToolbar";
import DataGridTextField from "src/components/DataGridPro/DataGridTextField";
import ProjectFilesTypeSelect from "./ProjectFilesTypeSelect";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import DataGridActions from "src/components/DataGridPro/DataGridActions";

const useStyles = makeStyles(() => ({
  title: {
    padding: "0rem 0 2rem 0",
  },
  uploadFileButton: {
    float: "right",
  },
  ellipsisOverflow: {
    cursor: "pointer",
    overflow: "hidden",
    display: "block",
    textOverflow: "ellipsis",
  },
  codeStyle: {
    backgroundColor: "#eee",
    fontFamily: "monospace",
    display: "block",
    wordWrap: "break-word",
    paddingLeft: "4px",
    paddingRight: "4px",
    fontSize: "14px",
  },
}));

const fileTypes = ["", "Funding", "Plans", "Estimates", "Other"];

// remove the FilePond and s3 added path for display, ex:
// 'private/project/65/80_04072022191747_40d4c982e064d0f9_1800halfscofieldridgepwkydesignprint.pdf'
const cleanUpFileKey = (str) => str.replace(/^(?:[^_]*_){3}/g, "");

const requiredFields = ["file_name", "file_url", "file_type"];

const useColumns = ({
  classes,
  token,
  rowModesModel,
  handleEditClick,
  handleSaveClick,
  handleCancelClick,
  handleDeleteOpen,
  validateFileInput,
}) =>
  useMemo(() => {
    return [
      {
        headerName: "Name",
        field: "file_name",
        width: 200,
        editable: true,
        renderCell: ({ row }) => (
          <Typography className={classes.ellipsisOverflow}>
            {row?.file_name}
          </Typography>
        ),
        // validate input
        preProcessEditCellProps: (params) => {
          const hasError =
            !params.props.value || params.props.value.trim().length < 1;
          return { ...params.props, error: hasError };
        },
        renderEditCell: (props) => (
          <DataGridTextField helperText="Required" {...props} />
        ),
      },
      {
        headerName: "File",
        field: "file_url",
        width: 200,
        editable: true,
        preProcessEditCellProps: validateFileInput,
        renderCell: ({ row }) => {
          if (row.file_key) {
            return (
              <Link
                className={classes.ellipsisOverflow}
                onClick={() => downloadFileAttachment(row?.file_key, token)}
              >
                {cleanUpFileKey(row?.file_key)}
              </Link>
            );
          }
          return isValidUrl(row?.file_url) ? (
            <ExternalLink
              linkProps={{ className: classes.ellipsisOverflow }}
              url={row?.file_url}
              text={row?.file_url}
            />
          ) : (
            // if the user provided file_url is not a valid url, just render the text
            <Typography className={classes.codeStyle}>
              {row?.file_url}
            </Typography>
          );
        },
        renderEditCell: (props) =>
          // users cannot edit the file_key, since its provided by the FilePond upload interface
          props.row.file_key ? (
            <Typography>{cleanUpFileKey(props.row.file_key)}</Typography>
          ) : (
            <DataGridTextField
              helperText="Required"
              disabled={!!props.row.file_key}
              {...props}
            />
          ),
      },
      {
        headerName: "Type",
        field: "file_type",
        editable: true,
        width: 150,
        valueFormatter: (value) => fileTypes[value],
        sortComparator: (v1, v2, param1, param2) => {
          return gridStringOrNumberComparator(
            fileTypes[v1],
            fileTypes[v2],
            param1,
            param2
          );
        },
        renderEditCell: (props) => <ProjectFilesTypeSelect {...props} />,
      },
      {
        headerName: "Description",
        field: "file_description",
        editable: true,
        width: 200,
        renderEditCell: (props) => <DataGridTextField {...props} multiline />,
      },
      {
        headerName: "Uploaded by",
        field: "moped_user",
        width: 150,
        // including valueGetter so the sort function knows what value to sort on
        valueGetter: (value) => value?.first_name + " " + value?.last_name,
        renderCell: ({ row }) => (
          <span>
            {row?.created_by_user_id
              ? row?.moped_user?.first_name + " " + row?.moped_user?.last_name
              : "N/A"}
          </span>
        ),
      },
      {
        headerName: "Date uploaded",
        field: "created_at",
        width: 200,
        renderCell: ({ value }) => (
          <FormattedDateString
            date={value}
            primary="relative"
            secondary="absolute"
          />
        ),
      },
      {
        headerName: "File size",
        field: "file_size",
        width: 75,
        renderCell: ({ row }) => (
          <span>
            {row.file_key ? humanReadableFileSize(row?.file_size ?? 0) : ""}
          </span>
        ),
      },
      {
        headerName: "",
        field: "edit",
        hideable: false,
        filterable: false,
        sortable: false,
        editable: false,
        type: "actions",
        renderCell: ({ id }) => (
          <DataGridActions
            id={id}
            requiredFields={requiredFields}
            rowModesModel={rowModesModel}
            handleCancelClick={handleCancelClick}
            handleDeleteOpen={handleDeleteOpen}
            handleSaveClick={handleSaveClick}
            handleEditClick={handleEditClick}
          />
        ),
      },
    ];
  }, [
    classes,
    token,
    rowModesModel,
    handleSaveClick,
    handleCancelClick,
    handleEditClick,
    handleDeleteOpen,
    validateFileInput,
  ]);

/**
 * Renders a list of file attachments for a project
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const ProjectFiles = () => {
  const apiRef = useGridApiRef();
  const classes = useStyles();
  const { projectId } = useParams();
  const { user } = useUser();
  const token = getJwt(user);
  // rows and rowModesModel used in DataGrid
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);

  /**
   * Handles the upload file button onClick behavior
   */
  const handleClickUploadFile = () => {
    setDialogOpen(true);
  };

  /**
   * Handles the cancel button onClick behavior
   */
  const handleClickCloseUploadFile = () => {
    setDialogOpen(false);
  };

  const handleDeleteOpen = useCallback(
    (id) => () => {
      setIsDeleteConfirmationOpen(true);
      setDeleteConfirmationId(id);
    },
    []
  );

  /**
   * Persists the file data into the database
   * @param {Object} fileDataBundle - The file bundle as provided by the FileUpload component
   */
  const handleClickSaveFile = (fileDataBundle) => {
    createProjectFileAttachment({
      variables: {
        object: {
          project_id: projectId,
          file_name: fileDataBundle?.name,
          file_type: fileDataBundle?.type,
          file_description: fileDataBundle?.description,
          file_key: fileDataBundle?.key,
          file_size: fileDataBundle?.file?.fileSize ?? 0,
          file_url: fileDataBundle?.url,
        },
      },
    })
      .then(() => {
        setDialogOpen(false);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        refetch();
      });
  };

  /**
   * List of files query
   */
  const { loading, error, data, refetch } = useQuery(PROJECT_FILE_ATTACHMENTS, {
    variables: { projectId },
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    if (data && data.moped_project_files.length > 0) {
      setRows(data.moped_project_files);
    }
  }, [data]);

  const [updateProjectFileAttachment] = useMutation(
    PROJECT_FILE_ATTACHMENTS_UPDATE
  );
  const [deleteProjectFileAttachment] = useMutation(
    PROJECT_FILE_ATTACHMENTS_DELETE
  );
  const [createProjectFileAttachment] = useMutation(
    PROJECT_FILE_ATTACHMENTS_CREATE
  );

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleEditClick = useCallback(
    (id) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    },
    [rowModesModel]
  );

  const handleSaveClick = useCallback(
    (id) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    },
    [rowModesModel]
  );

  // when a user cancels editing by clicking the X in the actions
  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  // handles row delete
  const handleDeleteClick = useCallback(
    (id) => () => {
      // remove row from rows in state
      setRows(rows.filter((row) => row.project_file_id !== id));

      deleteProjectFileAttachment({
        variables: {
          fileId: id,
        },
      })
        .then(() => refetch())
        .then(() => setIsDeleteConfirmationOpen(false))
        .catch((error) => {
          console.error(error);
        });
    },
    [rows, deleteProjectFileAttachment, refetch]
  );

  // saves row update after editing an existing row
  const processRowUpdate = (updatedRow, originalRow) => {
    const hasRowChanged = !isEqual(updatedRow, originalRow);
    const updateProjectFilesData = updatedRow;

    if (!hasRowChanged) {
      return Promise.resolve(updatedRow);
    } else {
      updateProjectFilesData.file_description =
        !updateProjectFilesData.file_description ||
        updateProjectFilesData.file_description.trim() === ""
          ? null
          : updateProjectFilesData.file_description;
      return (
        updateProjectFileAttachment({
          variables: {
            fileId: updateProjectFilesData.project_file_id,
            fileType: updateProjectFilesData.file_type,
            fileName: updateProjectFilesData.file_name || null,
            fileDescription: updateProjectFilesData.file_description,
            fileUrl: updateProjectFilesData.file_url || null,
          },
        })
          .then(() => refetch())
          // from the data grid docs:
          // Please note that the processRowUpdate must return the row object to update the Data Grid internal state.
          .then(() => updateProjectFilesData)
          .catch((error) => console.error(error))
      );
    }
  };

  const handleProcessUpdateError = (error) => {
    console.error(error);
  };

  // Validate the input for the file url or file Key field
  // returns Object: ...params.props and if there is an error
  const validateFileInput = (params) => {
    // if the file is uploaded to s3, then there is a file_key and users cannot edit it
    if (params.row.file_key) {
      return { ...params.props, error: false };
    }
    // if there is no file_key, then the file_url (the input's value) cannot be blank
    const hasError =
      !params.props.value || params.props.value.trim().length < 1;
    return { ...params.props, error: hasError };
  };

  const dataGridColumns = useColumns({
    classes,
    token,
    rowModesModel,
    handleDeleteOpen,
    handleSaveClick,
    handleCancelClick,
    handleEditClick,
    validateFileInput,
  });

  // If no data or loading show progress circle
  if (loading || !data) return <CircularProgress />;

  return (
    <CardContent>
      <ApolloErrorHandler errors={error}>
        <DataGridPro
          sx={dataGridProStyleOverrides}
          apiRef={apiRef}
          ref={apiRef}
          autoHeight
          columns={dataGridColumns}
          rows={rows}
          getRowId={(row) => row.project_file_id}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={handleProcessUpdateError}
          disableRowSelectionOnClick
          toolbar
          density="comfortable"
          getRowHeight={() => "auto"}
          hideFooter
          localeText={{ noRowsLabel: "No files to display" }}
          initialState={{ pinnedColumns: { right: ["edit"] } }}
          slots={{
            toolbar: ProjectFilesToolbar,
          }}
          slotProps={{
            toolbar: {
              onClick: handleClickUploadFile,
            },
          }}
        />
      </ApolloErrorHandler>
      <FileUploadDialogSingle
        title={"Add file"}
        dialogOpen={dialogOpen}
        handleClickCloseUploadFile={handleClickCloseUploadFile}
        handleClickSaveFile={handleClickSaveFile}
        projectId={projectId}
      />
      <DeleteConfirmationModal
        type={"file"}
        submitDelete={handleDeleteClick(deleteConfirmationId)}
        isDeleteConfirmationOpen={isDeleteConfirmationOpen}
        setIsDeleteConfirmationOpen={setIsDeleteConfirmationOpen}
      />
    </CardContent>
  );
};

export default ProjectFiles;
