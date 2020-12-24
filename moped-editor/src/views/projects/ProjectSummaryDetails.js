import React from "react";
import ProjectSummaryMap from "./ProjectSummaryDetailsMap";
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
    project_extent_geojson,
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
      <Grid item xs={6}>
        <Grid container>
          {projectDetails.map(detail => (
            <Grid item xs={6}>
              <Box mb={2} mr={2}>
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
      </Grid>
      <Grid item xs={6}>
        <ProjectSummaryMap projectExtentGeoJSON={project_extent_geojson} />
      </Grid>
    </Grid>
  );
};

export default ProjectSummaryDetails;
