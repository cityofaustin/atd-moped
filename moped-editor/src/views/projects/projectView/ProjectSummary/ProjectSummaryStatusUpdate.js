import React from "react";

import { Box, Grid } from "@material-ui/core";
import parse from "html-react-parser";

import { makeUSExpandedFormDateFromTimeStampTZ } from "../../../../utils/dateAndTime";
import DashboardStatusModal from "src/views/dashboard/DashboardStatusModal";

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
  const statusUpdate = data.moped_project[0].moped_proj_notes[0]?.project_note;
  const projectName = data.moped_project[0].project_name;
  const addedBy = data.moped_project[0].moped_proj_notes[0]?.added_by;
  const dateCreated = makeUSExpandedFormDateFromTimeStampTZ(
    data.moped_project[0].moped_proj_notes[0]?.date_created
  ).toUpperCase();

  return (
    <Grid item xs={12} className={classes.fieldGridItem}>
      <Box display="flex" justifyContent="flex-start">
        <DashboardStatusModal
          projectId={projectId}
          projectName={projectName}
          modalParent="summary"
          statusUpdate={statusUpdate}
          queryRefetch={refetch}
        >
          <Box className={classes.fieldBox}>
            <span className={classes.fieldLabel}>Status update</span>
            {!!statusUpdate && (
              <>
                <span className={classes.fieldLabelTextSpan}>
                  {parse(String(statusUpdate))}
                </span>
                <span className={classes.fieldAuthor}>{addedBy}</span>
                <span className={classes.fieldLabel}>
                  {makeUSExpandedFormDateFromTimeStampTZ(
                    dateCreated
                  ).toUpperCase()}
                </span>
              </>
            )}
          </Box>
        </DashboardStatusModal>
      </Box>
    </Grid>
  );
};

export default ProjectSummaryStatusUpdate;
