import React, { useState } from "react";
import { useParams } from "react-router-dom";

import ProjectSummaryTable from "./ProjectSummaryTable";
import ProjectSummaryMap from "./ProjectSummaryMap";
import { createFeatureCollectionFromProjectFeatures } from "../../../utils/mapHelpers";

import {
  Grid,
  CardContent,
  CircularProgress,
  TextField,
  Icon,
  Box,
} from "@material-ui/core";
import ApolloErrorHandler from "../../../components/ApolloErrorHandler";

import ControlPointIcon from "@material-ui/icons/ControlPoint";

import {
  PROJECT_SUMMARY_STATUS_UPDATE_INSERT,
  PROJECT_SUMMARY_STATUS_UPDATE_UPDATE,
} from "../../../queries/project";

/*
  Error Handler and Fallback Component
*/
import ProjectSummaryMapFallback from "./ProjectSummaryMapFallback";
import { ErrorBoundary } from "react-error-boundary";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useMutation } from "@apollo/client";
import { getSessionDatabaseData } from "../../../auth/user";

const useStyles = makeStyles(theme => ({
  fieldGridItem: {
    margin: theme.spacing(2),
  },
  editIcon: {
    cursor: "pointer",
    margin: "28px 0 0 8px",
    fontSize: "20px",
  },
  editIconConfirm: {
    cursor: "pointer",
    margin: "28px 0 0 8px",
    fontSize: "24px",
  },
}));

/**
 * Project Summary Component
 * @param {boolean} loading - True if it is loading
 * @param {Object} error - Error content if provided
 * @param {Object} data - THe query data
 * @param {function} refetch - A function to reload the data
 * @return {JSX.Element}
 * @constructor
 */
const ProjectSummary = ({ loading, error, data, refetch }) => {
  const { projectId } = useParams();
  const classes = useStyles();
  const userSessionData = getSessionDatabaseData();

  const [makeSureRefresh, setMakeSureRefresh] = useState(false);
  const [mapError, setMapError] = useState(false);

  const [updateProjectStatusUpdateInsert] = useMutation(
    PROJECT_SUMMARY_STATUS_UPDATE_INSERT
  );

  const [updateProjectStatusUpdateUpdate] = useMutation(
    PROJECT_SUMMARY_STATUS_UPDATE_UPDATE
  );

  /**
   * Retrieve the last note made as a status update (which are ordered by date)
   * @param {String} fieldName - The name of the field to retrieve in the moped_proj_note object
   * @return {string|null}
   */
  const getStatusUpdate = (fieldName = "project_note") => {
    const lastItem =
      (data?.moped_project[0]?.moped_proj_notes?.length ?? 0) - 1;
    if (lastItem >= 0) {
      // Get the data from the note
      const note =
        data.moped_project[0].moped_proj_notes[lastItem][fieldName] ?? "";
      // Remove any HTML tags
      return note ? String(note).replace(/(<([^>]+)>)/gi, "") : null;
    }
    return null;
  };

  /**
   * Status Update State Variables
   */
  const [statusUpdate, setStatusUpdate] = useState(getStatusUpdate());
  const [statusUpdateAddNew, setStatusUpdateAddNew] = useState(false);
  const [statusUpdateEditable, setStatusUpdateEditable] = useState(false);

  if (loading) return <CircularProgress />;
  if (error) return `Error! ${error.message}`;

  const projectFeatureRecords = data?.moped_project[0]?.moped_proj_features;
  const projectFeatureCollection = createFeatureCollectionFromProjectFeatures(
    projectFeatureRecords
  );

  /**
   * Handles updating the state for "status update"
   * @param {Object} event
   */
  const handleStatusUpdateChange = event => setStatusUpdate(event.target.value);

  /**
   * Handles the edit click for status update
   */
  const handleStatusUpdateEdit = () => {
    setStatusUpdateEditable(true);
  };

  /**
   * Handles adding a new status update
   */
  const handleStatusUpdateAddNew = () => {
    setStatusUpdateAddNew(true);
    setStatusUpdateEditable(true);
    setStatusUpdate("");
  };

  /**
   * Handles saving the status update
   */
  const handleStatusUpdateSave = () => {
    // Retrieve a commentId or get a null
    const commentId = getStatusUpdate("project_note_id");
    const addedBy = `${userSessionData.first_name} ${userSessionData.last_name}`;
    (statusUpdateAddNew
      ? updateProjectStatusUpdateInsert
      : updateProjectStatusUpdateUpdate)({
      variables: {
        ...(statusUpdateAddNew
          ? {
              statusUpdate: {
                project_id: Number(projectId),
                added_by: addedBy,
                project_note: statusUpdate,
                status_id: 1,
                project_note_type: 2,
              },
            }
          : {
              project_note_id: { _eq: Number(commentId) },
              added_by: addedBy,
              project_note: statusUpdate,
            }),
      },
    })
      .then(() => {
        console.log((commentId ? "Updated" : "Created") + " project note");
        setStatusUpdateEditable(false);
      })
      .catch(err => {
        console.log("Error: " + err);
      });
  };

  /**
   * Handle canceling the status update
   */
  const handleStatusUpdateCancel = () => {
    // Retrieve original value
    setStatusUpdate(getStatusUpdate());
    // Reset edit-mode state
    setStatusUpdateEditable(false);
    setStatusUpdateAddNew(false);
  };

  if (projectFeatureRecords.length === 0 && !makeSureRefresh)
    setMakeSureRefresh(true);

  return (
    <ApolloErrorHandler errors={error}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            {/*Status Update*/}
            <Grid item xs={12} className={classes.fieldGridItem}>
              <Box display="flex" justifyContent="flex-end">
                {/*The text field is only an input/output component only,
                it does not track or change the state. If nothing shows,
                make sure your comments are type id = 2*/}
                <TextField
                  fullWidth
                  {...(statusUpdateEditable ? { variant: "filled" } : {})}
                  id="project_note_id"
                  label="Status Update"
                  value={statusUpdate}
                  onChange={handleStatusUpdateChange}
                  InputProps={{
                    readOnly: !statusUpdateEditable,
                  }}
                />
                {/*Edit Button*/}
                {!statusUpdateEditable && (
                  <Icon
                    className={classes.editIcon}
                    onClick={handleStatusUpdateEdit}
                  >
                    edit
                  </Icon>
                )}
                {/*Add New Button*/}
                {!statusUpdateEditable && (
                  <ControlPointIcon
                    className={classes.editIcon}
                    onClick={handleStatusUpdateAddNew}
                  />
                )}
                {/*Save Button*/}
                {statusUpdateEditable && (
                  <Icon
                    className={classes.editIconConfirm}
                    onClick={handleStatusUpdateSave}
                  >
                    check
                  </Icon>
                )}
                {/*Cancel Button*/}
                {statusUpdateEditable && (
                  <Icon
                    className={classes.editIconConfirm}
                    onClick={handleStatusUpdateCancel}
                  >
                    close
                  </Icon>
                )}
              </Box>
            </Grid>
            <ProjectSummaryTable
              loading={loading}
              data={data}
              error={error}
              refetch={refetch}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            {projectFeatureCollection && (
              <ErrorBoundary
                FallbackComponent={({ error, resetErrorBoundary }) => (
                  <ProjectSummaryMapFallback
                    error={error}
                    resetErrorBoundary={resetErrorBoundary}
                    projectId={projectId}
                    refetchProjectDetails={refetch}
                    mapData={projectFeatureCollection}
                  />
                )}
                onReset={() => setMapError(false)}
                resetKeys={[mapError]}
              >
                <ProjectSummaryMap
                  projectExtentGeoJSON={projectFeatureCollection}
                />
              </ErrorBoundary>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </ApolloErrorHandler>
  );
};

export default ProjectSummary;
