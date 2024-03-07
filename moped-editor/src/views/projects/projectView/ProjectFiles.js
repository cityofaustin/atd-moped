import React, { useState } from "react";
import { useParams } from "react-router-dom";

import {
  Button,
  CardContent,
  CircularProgress,
  Link,
  TextField,
  Typography,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";
import typography from "../../../theme/typography";
import MaterialTable, {
  MTableEditRow,
  MTableAction,
  MTableToolbar,
} from "@material-table/core";
import {
  AddCircle as AddCircleIcon,
  DeleteOutline as DeleteOutlineIcon,
  EditOutlined as EditOutlinedIcon,
} from "@mui/icons-material";
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
import { getJwt, getDatabaseId, useUser } from "../../../auth/user";
import downloadFileAttachment from "../../../utils/downloadFileAttachment";
import { PAGING_DEFAULT_COUNT } from "../../../constants/tables";
import {
  formatTimeStampTZType,
  makeFullTimeFromTimeStampTZ,
} from "src/utils/dateAndTime";
import { isValidUrl } from "src/utils/urls";

const useStyles = makeStyles((theme) => ({
  title: {
    padding: "0rem 0 2rem 0",
  },
  uploadFileButton: {
    float: "right",
  },
  downloadLink: {
    cursor: "pointer",
  },
  codeStyle: {
    backgroundColor: "#eee",
    fontFamily: "monospace",
    display: "inline-block",
    paddingLeft: "4px",
    paddingRight: "4px",
    fontSize: "14px"
  },
}));

/**
 * Renders a list of file attachments for a project
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const ProjectFiles = (props) => {
  const classes = useStyles();
  const { projectId } = useParams();
  const { user } = useUser();
  const token = getJwt(user);

  /**
   * @constant {boolean} dialogOpen - True to make the save dialog visible
   * @function setDialogOpen - Changes the state of the dialogOpen constant
   */
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

  /** addAction Ref - mutable ref object used to access add action button
   * imperatively.
   * @type {object} addActionRef
   * */
  const addActionRef = React.useRef();

  /**
   * Mutations
   */
  const [updateProjectFileAttachment] = useMutation(
    PROJECT_FILE_ATTACHMENTS_UPDATE
  );

  const [deleteProjectFileAttachment] = useMutation(
    PROJECT_FILE_ATTACHMENTS_DELETE
  );

  const [createProjectFileAttachment] = useMutation(
    PROJECT_FILE_ATTACHMENTS_CREATE
  );

  // If no data or loading show progress circle
  if (loading || !data) return <CircularProgress />;

  const fileTypes = ["", "Funding", "Plans", "Estimates", "Other"];

  // remove the FilePond and s3 added path for display, ex:
  // 'private/project/65/80_04072022191747_40d4c982e064d0f9_1800halfscofieldridgepwkydesignprint.pdf'
  const cleanUpFileKey = (str) => str.replace(/^(?:[^_]*_){3}/g, "");

  /**
   * Column configuration for <MaterialTable>
   */
  const columns = [
    {
      title: "Name",
      field: "file_name",
      validate: (rowData) => {
        return rowData.file_name.length > 0 ? true : false;
      },
      editComponent: (props) => (
        <TextField
          variant="standard"
          id="file_name"
          name="file_name"
          value={props.value}
          onChange={(e) => props.onChange(e.target.value.trim())}
          helperText="Required"
        />
      ),
    },
    {
      title: "File",
      field: "file_url",
      validate: (rowData) => {
        return rowData.file_name.length > 0 ? true : false;
      },
      render: (record) => {
        if (record.file_key) {
          return (
            <Link
              className={classes.downloadLink}
              onClick={() => downloadFileAttachment(record?.file_key, token)}
            >
              {cleanUpFileKey(record?.file_key)}
            </Link>
          );
        }
        return isValidUrl(record?.file_url) ? (
          <ExternalLink
            className={classes.downloadLink}
            url={record?.file_url}
            text={record?.file_url}
          />
        ) : (
          // if the user provided file_url is not a valid url, just render the text
          <Typography className={classes.codeStyle}>
            {record?.file_url}
          </Typography>
        );
      },
      editComponent: (props) =>
        // users cannot edit the file_key, since its provided by the FilePond upload interface
        props.rowData.file_key ? (
          <Typography>{cleanUpFileKey(props.rowData.file_key)}</Typography>
        ) : (
          <TextField
            variant="standard"
            id="file_path"
            name="file_path"
            value={props.value}
            onChange={(e) => props.onChange(e.target.value.trim())}
            helperText="Required"
            disabled={!!props.rowData.file_key}
          />
        ),
    },
    {
      title: "Type",
      field: "file_type",
      render: (record) => <span>{fileTypes[record?.file_type]}</span>,
      editComponent: (props) => (
        <FormControl variant="standard">
          <Select
            variant="standard"
            id="file_description"
            name="file_description"
            value={props?.value}
            onChange={(e) => props.onChange(e.target.value)}
          >
            <MenuItem value={1}>Funding</MenuItem>
            <MenuItem value={2}>Plans</MenuItem>
            <MenuItem value={3}>Estimates</MenuItem>
            <MenuItem value={4}>Other</MenuItem>
          </Select>
          <FormHelperText>Required</FormHelperText>
        </FormControl>
      ),
    },
    {
      title: "Description",
      field: "file_description",
      render: (record) => <span>{record?.file_description}</span>,
      editComponent: (props) => (
        <TextField
          variant="standard"
          id="file_description"
          name="file_description"
          value={props?.value ?? ""}
          onChange={(e) => props.onChange(e.target.value)}
        />
      ),
    },
    {
      title: "Uploaded by",
      cellStyle: { fontFamily: typography.fontFamily },
      render: (record) => (
        <span>
          {record?.created_by_user_id
            ? record?.moped_user?.first_name +
              " " +
              record?.moped_user?.last_name
            : "N/A"}
        </span>
      ),
    },
    {
      title: "Date uploaded",
      cellStyle: { fontFamily: typography.fontFamily },
      customSort: (a, b) =>
        new Date(a?.created_at ?? 0) - new Date(b?.created_at ?? 0),
      render: (record) => (
        <span>
          {record?.created_at
            ? `${formatTimeStampTZType(
                record.created_at
              )}, ${makeFullTimeFromTimeStampTZ(record.created_at)}`
            : "N/A"}
        </span>
      ),
    },
    {
      title: "File size",
      cellStyle: { fontFamily: typography.fontFamily },
      customSort: (a, b) => (a?.file_size ?? 0) - (b?.file_size ?? 0),
      render: (record) => (
        <span>
          {record.file_key ? humanReadableFileSize(record?.file_size ?? 0) : ""}
        </span>
      ),
    },
  ];

  return (
    <CardContent>
      <ApolloErrorHandler errors={error}>
        <MaterialTable
          columns={columns}
          data={data?.moped_project_files ?? null}
          title={
            <Typography variant="h2" color="primary">
              Files
            </Typography>
          }
          // Action component customized as described in this gh-issue:
          // https://github.com/mbrn/material-table/issues/2133
          components={{
            EditRow: (props) => (
              <MTableEditRow
                {...props}
                onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    // Bypass default MaterialTable behavior of submitting the entire form when a user hits enter
                    // See https://github.com/mbrn/material-table/pull/2008#issuecomment-662529834
                  }
                }}
              />
            ),
            Action: (props) => {
              // If isn't the add action
              if (
                typeof props.action === typeof Function ||
                props.action.tooltip !== "Add"
              ) {
                return <MTableAction {...props} />;
              } else {
                return (
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    className={classes.uploadFileButton}
                    startIcon={<AddCircleIcon />}
                    ref={addActionRef}
                    onClick={handleClickUploadFile}
                  >
                    Add file
                  </Button>
                );
              }
            },
            Toolbar: (props) => (
              // to have it align with table content
              <div style={{ marginLeft: "-10px" }}>
                <MTableToolbar {...props} />
              </div>
            ),
          }}
          icons={{ Delete: DeleteOutlineIcon, Edit: EditOutlinedIcon }}
          options={{
            ...(data.moped_project_files.length < PAGING_DEFAULT_COUNT + 1 && {
              paging: false,
            }),
            search: false,
            rowStyle: { fontFamily: typography.fontFamily },
            actionsColumnIndex: -1,
            idSynonym: "project_file_id",
          }}
          localization={{
            header: {
              actions: "",
            },
            body: {
              emptyDataSourceMessage: (
                <Typography variant="body1">No files to display</Typography>
              ),
            },
          }}
          editable={{
            onRowAdd: () => {
              handleClickUploadFile();
            },
            onRowUpdate: (newData, oldData) =>
              updateProjectFileAttachment({
                variables: {
                  fileId: newData.project_file_id,
                  fileType: newData.file_type,
                  fileName: newData.file_name || null,
                  fileDescription: newData.file_description.trim() || null,
                  fileUrl: newData.file_url || null,
                },
              }).then(() => {
                refetch();
              }),
            onRowDelete: (oldData) =>
              deleteProjectFileAttachment({
                variables: {
                  fileId: oldData.project_file_id,
                },
              }).then(() => {
                refetch();
              }),
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
    </CardContent>
  );
};

export default ProjectFiles;
