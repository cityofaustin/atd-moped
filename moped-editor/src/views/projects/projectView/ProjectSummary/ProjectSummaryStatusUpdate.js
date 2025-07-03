import React from "react";

import { Box, Grid, Typography } from "@mui/material";
import parse from "html-react-parser";

import DashboardStatusModal from "src/views/dashboard/DashboardStatusModal";
import { formatRelativeDate } from "src/utils/dateAndTime";

/**
 * ProjectSummaryStatusUpdate Component
 * @param {Number} projectId - The id of the current project being viewed
 * @param {Object} data - The data object from the GraphQL query
 * @param {function} refetch - The refetch function from apollo
 * @param {Object} classes - The shared style settings
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectSummaryStatusUpdate = ({
  projectId,
  data,
  refetch,
  handleSnackbar,
  classes,
}) => {
  const statusUpdate =
    data.moped_project[0]?.project_list_view?.project_status_update;
  const projectName = data.moped_project[0]?.project_name;
  const author =
    data.moped_project[0]?.project_list_view?.project_status_update_author;
  const currentPhaseId =
    data.moped_project[0]?.moped_proj_phases[0]?.moped_phase.phase_id;

  const dateCreated = formatRelativeDate(
    data.moped_project[0]?.project_list_view?.project_status_update_date_created
  );
  const eCaprisSubprojectId = data.moped_project[0]?.ecapris_subproject_id;

  return (
    <Grid item xs={12} className={classes.fieldGridItem}>
      <Typography className={classes.fieldLabel}>Status update</Typography>
      <Box
        display="flex"
        justifyContent="flex-start"
        className={classes.fieldBox}
        flexWrap="nowrap"
        alignItems="center"
      >
        <DashboardStatusModal
          projectId={projectId}
          eCaprisSubprojectId={eCaprisSubprojectId}
          projectName={projectName}
          currentPhaseId={currentPhaseId}
          modalParent="summary"
          statusUpdate={statusUpdate}
          queryRefetch={refetch}
          handleSnackbar={handleSnackbar}
          classes={classes}
          data={data}
        >
          {!!statusUpdate && (
            <div>
              <div>{parse(String(statusUpdate))}</div>
              <span className={classes.fieldLabelSmall}>
                {author} - {dateCreated}
              </span>
            </div>
          )}
        </DashboardStatusModal>
      </Box>
    </Grid>
  );
};

export default ProjectSummaryStatusUpdate;
