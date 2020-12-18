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
    capitally_funded,
    eCapris_id,
  } = details.details;

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

  const formatValue = value => {
    let formattedValue = value.field;
    switch (value.type) {
      case "boolean":
        formattedValue = value.field === true ? "Yes" : "No";
        break;
      case "string":
        console.log(value.field);
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
    console.log(formattedValue);
    return formattedValue;
  };

  return (
    <Grid container spacing={2}>
      {projectDetails.map(detail => (
        <Grid item xs={6}>
          <Box mb={2}>
            <h4>{detail.label}</h4>
            <p>{formatValue(detail)}</p>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProjectSummaryDetails;
