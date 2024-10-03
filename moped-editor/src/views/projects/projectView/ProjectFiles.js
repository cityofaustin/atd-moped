import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import isEqual from "lodash/isEqual";

import { CardContent, CircularProgress, Link, Typography } from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";
import {
  DeleteOutline as DeleteOutlineIcon,
  EditOutlined as EditOutlinedIcon,
} from "@mui/icons-material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {
  DataGridPro,
  GridRowModes,
  GridActionsCellItem,
  useGridApiRef,
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
import {
  formatTimeStampTZType,
  makeFullTimeFromTimeStampTZ,
} from "src/utils/dateAndTime";
import { isValidUrl } from "src/utils/urls";
import ProjectFilesToolbar from "./ProjectFilesToolbar";
import DataGridTextField from "./DataGridTextField";
import ProjectFilesTypeSelect from "./ProjectFilesTypeSelect";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

const useStyles = makeStyles(() => ({
  title: {
    padding: "0rem 0 2rem 0",
  },
  uploadFileButton: {
    float: "right",
  },
  downloadLink: {
    cursor: "pointer",
    overflow: "hidden",
    display: "block",
    textOverflow: "ellipsis",
  },
  codeStyle: {
    backgroundColor: "#eee",
    fontFamily: "monospace",
    display: "inline-block",
    paddingLeft: "4px",
    paddingRight: "4px",
    fontSize: "14px",
  },
}));

const fileTypes = ["", "Funding", "Plans", "Estimates", "Other"];

// remove the FilePond and s3 added path for display, ex:
// 'private/project/65/80_04072022191747_40d4c982e064d0f9_1800halfscofieldridgepwkydesignprint.pdf'
const cleanUpFileKey = (str) => str.replace(/^(?:[^_]*_){3}/g, "");

const useColumns = ({
  classes,
  token,
  rowModesModel,
  handleEditClick,
  handleSaveClick,
  handleCancelClick,
  handleDeleteOpen,
}) =>
  useMemo(() => {
    return [
      {
        headerName: "Name",
        field: "file_name",
        width: 175,
        editable: true,
        // validate input
        preProcessEditCellProps: (params) => {
          const hasError = params.props.value.trim().length < 1;
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
        // validate input
        preProcessEditCellProps: (params) => {
          const hasError = params.props.value.trim().length < 1;
          return { ...params.props, error: hasError };
        },
        renderCell: ({ row }) => {
          if (row.file_key) {
            return (
              <Link
                className={classes.downloadLink}
                onClick={() => downloadFileAttachment(row?.file_key, token)}
              >
                {cleanUpFileKey(row?.file_key)}
              </Link>
            );
          }
          return isValidUrl(row?.file_url) ? (
            <ExternalLink
              linkProps={{ className: classes.downloadLink }}
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
        renderCell: ({ value }) => <span>{fileTypes[value]}</span>,
        renderEditCell: (props) => <ProjectFilesTypeSelect {...props} />,
      },
      {
        headerName: "Description",
        field: "file_description",
        editable: true,
        width: 200,
        renderEditCell: (props) => <DataGridTextField {...props} />,
      },
      {
        headerName: "Uploaded by",
        field: "moped_user",
        width: 150,
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
          <span>
            {value
              ? `${formatTimeStampTZType(value)}, ${makeFullTimeFromTimeStampTZ(
                  value
                )}`
              : "N/A"}
          </span>
        ),
      },
      {
        headerName: "File size",
        field: "file_size",
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
        getActions: ({ id }) => {
          const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
          if (isInEditMode) {
            return [
              <GridActionsCellItem
                icon={<CheckIcon sx={{ fontSize: "24px" }} />}
                label="Save"
                sx={{
                  color: "primary.main",
                }}
                onClick={handleSaveClick(id)}
              />,
              <GridActionsCellItem
                icon={<CloseIcon sx={{ fontSize: "24px" }} />}
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick(id)}
                color="inherit"
              />,
            ];
          }
          return [
            <GridActionsCellItem
              icon={<EditOutlinedIcon sx={{ fontSize: "24px" }} />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick(id)}
              color="inherit"
            />,
            <GridActionsCellItem
              icon={<DeleteOutlineIcon sx={{ fontSize: "24px" }} />}
              label="Delete"
              onClick={() => handleDeleteOpen(id)}
              color="inherit"
            />,
          ];
        },
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

  const handleDeleteOpen = useCallback((id) => {
    setIsDeleteConfirmationOpen(true);
    setDeleteConfirmationId(id);
  }, []);

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

  // saves row update, either editing an existing row or saving a new row
  const processRowUpdate = (updatedRow, originalRow) => {
    const hasRowChanged = !isEqual(updatedRow, originalRow);

    if (!hasRowChanged) {
      return Promise.resolve(updatedRow);
    } else {
      return (
        updateProjectFileAttachment({
          variables: {
            fileId: updatedRow.project_file_id,
            fileType: updatedRow.file_type,
            fileName: updatedRow.file_name || null,
            fileDescription: updatedRow.file_description.trim() || null,
            fileUrl: updatedRow.file_url || null,
          },
        })
          .then(() => refetch())
          // from the data grid docs:
          // Please note that the processRowUpdate must return the row object to update the Data Grid internal state.
          .then(() => updatedRow)
          .catch((error) => console.error(error))
      );
    }
  };

  const handleProcessUpdateError = (error) => {
    console.error(error);
  };

  const dataGridColumns = useColumns({
    classes,
    token,
    rowModesModel,
    handleDeleteOpen,
    handleSaveClick,
    handleCancelClick,
    handleEditClick,
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
