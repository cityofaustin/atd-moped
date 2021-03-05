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

import { useQuery } from "@apollo/client";

import humanReadableFileSize from "../../../utils/humanReadableFileSize";
import ApolloErrorHandler from "../../../components/ApolloErrorHandler";
import FileUploadDialogSingle from "../../../components/FileUpload/FileUploadDialogSingle";
import { PROJECT_FILE_ATTACHMENTS } from "../../../queries/project";
import { getJwt, useUser } from "../../../auth/user";
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

const ProjectFiles = props => {
  const classes = useStyles();
  const { projectId } = useParams();
  const { user } = useUser();
  const token = getJwt(user);

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleClickUploadFile = () => {
    setDialogOpen(true);
  };

  const handleClickCloseUploadFile = () => {
    setDialogOpen(false);
  };

  const handleClickSaveFile = fileDataBundle => {
    console.log("Data Bundle: ", fileDataBundle);
    setDialogOpen(false);
  };

  const {
    loading,
    error,
    data,
    //  refetch
  } = useQuery(PROJECT_FILE_ATTACHMENTS, {
    variables: { projectId },
    fetchPolicy: "no-cache",
  });
  // const [addProjectPersonnel] = useMutation(ADD_PROJECT_PERSONNEL);
  // const [updateProjectPersonnel] = useMutation(UPDATE_PROJECT_PERSONNEL);
  //

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
          onChange={null}
        />
      ),
    },
    {
      title: "File Description",
      field: "file_description",
      render: record => <span>{record?.file_description}</span>,
    },
    {
      title: "File Size",
      field: "file_description",
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
            search: false,
            rowStyle: { fontFamily: typography.fontFamily },
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
