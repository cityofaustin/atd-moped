import React from "react";
import { Box, Grid } from "@material-ui/core";

const ProjectSummaryDetails = details => {
  const {
    current_status,
    current_phase,
    project_description,
    start_date,
    fiscal_year,
    project_priority,
    eCapris_id,
  } = details.details;

  const projectDetails = [
    {
      field: current_status,
      label: "Current Status",
    },
    {
      field: current_phase,
      label: "Current Phase",
    },
    {
      field: project_description,
      label: "Description",
    },
    {
      field: start_date,
      label: "Start Date",
    },
    {
      field: fiscal_year,
      label: "Fiscal Year",
    },
    {
      field: project_priority,
      label: "Priority",
    },
    {
      field: eCapris_id,
      label: "eCapris ID",
    },
  ];

  return (
    <Grid container spacing={2}>
      {projectDetails.map(detail => (
        <Grid item xs={6}>
          <Box mb={2}>
            <h4>{detail.label}</h4>
            {detail.field ? (
              <p>{detail.field}</p>
            ) : (
              <Box color="text.disabled">
                <p>No data</p>
              </Box>
            )}
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProjectSummaryDetails;
