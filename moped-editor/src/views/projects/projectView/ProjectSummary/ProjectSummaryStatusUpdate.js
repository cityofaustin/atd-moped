import React, { useState } from "react";
import { useMutation } from "@apollo/client";

import {
  Box,
  Grid,
  Icon,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import parse from "html-react-parser";
import DOMPurify from "dompurify";
import ControlPointIcon from "@material-ui/icons/ControlPoint";

import {
  PROJECT_SUMMARY_STATUS_UPDATE_INSERT,
  PROJECT_SUMMARY_STATUS_UPDATE_UPDATE,
} from "../../../../queries/project";

import { getSessionDatabaseData } from "../../../../auth/user";
import { makeUSExpandedFormDateFromTimeStampTZ } from "../../../../utils/dateAndTime";
import { getUserFullName } from "src/utils/userNames";

/**
 * ProjectSummaryStatusUpdate Component
 * @param {Number} projectId - The id of the current project being viewed
 * @param {Object} data - The data object from the GraphQL query
 * @param {function} refetch - The refetch function from apollo
 * @param {Object} classes - The shared style settings
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectSummaryStatusUpdate = ({ projectId, data, refetch, classes }) => {
  const userSessionData = getSessionDatabaseData();
  const userId = userSessionData.user_id
  const addedBy = getUserFullName(userSessionData);

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
  const getStatusUpdate = fieldName => {
    const lastItem =
      (data?.moped_project[0]?.moped_proj_notes?.length ?? 0) - 1;
    if (lastItem >= 0) {
      // Get the data from the note
      const note = data
        ? data?.moped_project[0].moped_proj_notes[lastItem][fieldName] ?? ""
        : null;
      // Remove any HTML tags for status update string
      return note ? parse(String(note)) : null;
    }
    return null;
  };

  /**
   * Status Update State Variables
   */
  const [statusUpdate, setStatusUpdate] = useState(
    getStatusUpdate("project_note")
  );
  const [statusUpdateAddNew, setStatusUpdateAddNew] = useState(false);
  const [statusUpdateEditable, setStatusUpdateEditable] = useState(false);

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
    const isStatusUpdateInsert = statusUpdateAddNew || !commentId;

    (isStatusUpdateInsert
      ? updateProjectStatusUpdateInsert
      : updateProjectStatusUpdateUpdate)({
      variables: {
        ...(isStatusUpdateInsert
          ? {
              statusUpdate: {
                project_id: Number(projectId),
                added_by: addedBy,
                added_by_user_id: userId,
                project_note: DOMPurify.sanitize(statusUpdate),
                project_note_type: 2,
              },
            }
          : {
              project_note_id: { _eq: Number(commentId) },
              added_by: addedBy,
              project_note: DOMPurify.sanitize(statusUpdate),
            }),
      },
    })
      .then(() => {
        console.info((commentId ? "Updated" : "Created") + " project note");
        refetch().then(() => {
          setStatusUpdateEditable(false);
          setStatusUpdateAddNew(false);
        });
      })
      .catch(err => {
        console.warn("Error: " + err);
      });
  };

  /**
   * Handle canceling the status update
   */
  const handleStatusUpdateCancel = () => {
    // Retrieve original value
    setStatusUpdate(getStatusUpdate("project_note"));
    // Reset edit-mode state
    setStatusUpdateEditable(false);
    setStatusUpdateAddNew(false);
  };

  /**
   * Only allow the user who wrote the status to edit it
   */
  const isEditableComment =
    userId === parseInt(getStatusUpdate("added_by_user_id"));

  return (
    <Grid item xs={12} className={classes.fieldGridItem}>
      <Box display="flex" justifyContent="flex-start">
        {/*The text field is only an input/output component only,
                it does not track or change the state. If nothing shows,
                make sure your comments are type id = 2*/}
        {statusUpdateEditable && (
          <TextField
            fullWidth
            id="project_note_id"
            label="Status update"
            value={statusUpdate}
            onChange={handleStatusUpdateChange}
            multiline={true}
            rows={3}
            InputProps={{
              readOnly: !statusUpdateEditable,
            }}
          />
        )}
        {!statusUpdateEditable && (
          <Box className={classes.fieldBox}>
            <Typography className={classes.fieldLabel}>
              Status update
            </Typography>
            <Typography
              className={classes.fieldBoxTypography}
              onClick={isEditableComment ? handleStatusUpdateEdit : null}
            >
              <span className={classes.fieldLabelTextSpan}>
                {statusUpdate || "None"}
              </span>
            </Typography>
            {!!statusUpdate && (
              <Typography>
                <span className={classes.fieldAuthor}>
                  {getStatusUpdate("added_by")}
                </span>
                <span className={classes.fieldLabel}>
                  {makeUSExpandedFormDateFromTimeStampTZ(
                    getStatusUpdate("date_created")
                  ).toUpperCase()}
                </span>
              </Typography>
            )}
          </Box>
        )}
        {/*Add New Button*/}
        {!statusUpdateEditable && (
          <Tooltip title="Create new status update">
            <ControlPointIcon
              className={classes.editIcon}
              onClick={handleStatusUpdateAddNew}
            />
          </Tooltip>
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
  );
};

export default ProjectSummaryStatusUpdate;
