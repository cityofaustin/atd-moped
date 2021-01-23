import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { useParams } from "react-router-dom";
import ProjectSummaryMap from "./ProjectSummaryMap";
import ProjectSummaryEditMap from "./ProjectSummaryEditMap";
import { Box, Grid, CardContent, CircularProgress } from "@material-ui/core";
import { SUMMARY_QUERY } from "../../../queries/project";

const formatValue = value => {
  let formattedValue = value.field;
  switch (value.type) {
    case "boolean":
      formattedValue = value.field === true ? "Yes" : "No";
      break;
    case "string":
      formattedValue =
        value.field === "" ? (
          <Box color="text.disabled">
            <p>No data</p>
          </Box>
        ) : (
          value.field
        );
      break;
    default:
      break;
  }
  return formattedValue;
};

const ProjectSummary = () => {
  const { projectId } = useParams();

  const [isEditing, setIsEditing] = useState(false);
  const { loading, error, data } = useQuery(SUMMARY_QUERY, {
    variables: { projectId },
  });

  if (loading) return <CircularProgress />;
  if (error) return `Error! ${error.message}`;

  const {
    current_status,
    current_phase,
    project_description,
    start_date,
    fiscal_year,
    project_priority,
    capitally_funded,
    eCapris_id,
    project_extent_ids,
    project_extent_geojson,
  } = data.moped_project[0];

  const projectDetails = [
    {
      field: current_status,
      label: "Current Status",
      type: "string",
    },
    {
      field: current_phase,
      label: "Current Phase",
      type: "string",
    },
    {
      field: project_description,
      label: "Description",
      type: "string",
    },
    {
      field: start_date,
      label: "Start Date",
      type: "string",
    },
    {
      field: fiscal_year,
      label: "Fiscal Year",
      type: "string",
    },
    {
      field: project_priority,
      label: "Priority",
      type: "string",
    },
    {
      field: capitally_funded,
      label: "Capital Funding",
      type: "boolean",
    },
    {
      field: eCapris_id,
      label: "eCapris ID",
      type: "string",
    },
  ];

  return (
    <CardContent>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Grid container>
            {projectDetails.map(detail => (
              <Grid item xs={6}>
                <Box mb={2}>
                  <h4>{detail.label}</h4>
                  <p>{formatValue(detail)}</p>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          {project_extent_geojson && project_extent_ids && (
            <ProjectSummaryMap
              selectedLayerIds={project_extent_ids}
              projectExtentGeoJSON={project_extent_geojson}
            />
          )}
          {isEditing && <ProjectSummaryEditMap />}
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default ProjectSummary;
