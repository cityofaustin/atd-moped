import React, { useState } from "react";
import { useParams } from "react-router-dom";

import {
  Button,
  CardContent,
  CircularProgress,
  Grid,
  Icon,
  Link,
  TextField,
} from "@material-ui/core";

import makeStyles from "@material-ui/core/styles/makeStyles";
import typography from "../../../theme/typography";
import MaterialTable from "material-table";
import { Clear as ClearIcon } from "@material-ui/icons";

import { useMutation, useQuery } from "@apollo/client";

import humanReadableFileSize from "../../../utils/humanReadableFileSize";
import ApolloErrorHandler from "../../../components/ApolloErrorHandler";
import FileUploadDialogSingle from "../../../components/FileUpload/FileUploadDialogSingle";
import {
  PROJECT_FILE_ATTACHMENTS,
  PROJECT_FILE_ATTACHMENTS_DELETE,
  PROJECT_FILE_ATTACHMENTS_UPDATE,
  PROJECT_FILE_ATTACHMENTS_CREATE,
} from "../../../queries/project";
import { getJwt, getDatabaseId, useUser } from "../../../auth/user";
import downloadFileAttachment from "../../../utils/downloadFileAttachment";

const useStyles = makeStyles(theme => ({
  title: {
    padding: "0rem 0 2rem 0",
  },
  uploadFileButton: {
    float: "right",
  },
  downloadLink: {
    cursor: "pointer",
  },
}));

/**
 * Renders a list of file attachments for a project
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const ProjectFiles = props => {
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
  const handleClickSaveFile = fileDataBundle => {
    createProjectFileAttachment({
      variables: {
        object: {
          project_id: projectId,
          file_name: fileDataBundle?.name,
          file_description: fileDataBundle.description,
          file_key: fileDataBundle.key,
          file_size: fileDataBundle?.file?.fileSize ?? 0,
          created_by: getDatabaseId(user),
        },
      },
    }).then(() => {
      setDialogOpen(false);
    }).finally(() => {
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

  /**
   * Column configuration for <MaterialTable>
   */
  const columns = [
    {
      title: "Name",
      field: "file_name",
      render: record => (
        <Link
          className={classes.downloadLink}
          onClick={() => downloadFileAttachment(record?.file_key, token)}
        >
          {record?.file_name}
        </Link>
      ),
      editComponent: props => (
        <TextField
          id="file_name"
          name="file_name"
          value={props.value}
          onChange={e => props.onChange(e.target.value)}
        />
      ),
    },
    {
      title: "File Description",
      field: "file_description",
      render: record => <span>{record?.file_description}</span>,
      editComponent: props => (
        <TextField
          id="file_description"
          name="file_description"
          value={props?.value}
          onChange={e => props.onChange(e.target.value)}
        />
      ),
    },
    {
      title: "Created By",
      render: record => (
        <span>
          {record?.created_by
            ? record?.moped_user?.first_name +
              " " +
              record?.moped_user?.last_name
            : "N/A"}
        </span>
      ),
    },
    {
      title: "Created Date",
      render: record => (
        <span>
          {record?.create_date
            ? new Date(record?.create_date).toLocaleString()
            : "N/A"}
        </span>
      ),
    },
    {
      title: "File Size",
      render: record => (
        <span>{humanReadableFileSize(record?.file_size ?? 0)}</span>
      ),
    },
  ];

  return (
    <CardContent>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Grid container>
            <Grid sm={12} md={6}>
              <h2 className={classes.title}>File Attachments</h2>
            </Grid>
            <Grid sm={12} md={6}>
              <Button
                variant="contained"
                color="primary"
                className={classes.uploadFileButton}
                startIcon={<Icon>backup</Icon>}
                onClick={handleClickUploadFile}
              >
                Upload File
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <ApolloErrorHandler errors={error}>
        <MaterialTable
          columns={columns}
          data={data?.moped_project_files ?? null}
          title="Project File Attachments"
          icons={{ Delete: ClearIcon }}
          options={{
            search: true,
            rowStyle: { fontFamily: typography.fontFamily },
          }}
          editable={{
            onRowUpdate: (newData, oldData) =>
              updateProjectFileAttachment({
                variables: {
                  fileId: newData.project_file_id,
                  fileName: newData.file_name,
                  fileDescription: newData.file_description,
                },
              }).then(() => {
                refetch();
              }),
            onRowDelete: oldData =>
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
        title={"Upload Media"}
        dialogOpen={dialogOpen}
        handleClickCloseUploadFile={handleClickCloseUploadFile}
        handleClickSaveFile={handleClickSaveFile}
        projectId={projectId}
      />
    </CardContent>
  );
};

export default ProjectFiles;
