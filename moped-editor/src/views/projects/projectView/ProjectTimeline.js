import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { useParams } from "react-router-dom";
import { Box, Grid, CardContent, CircularProgress } from "@material-ui/core";
import { TIMELINE_QUERY } from "../../../queries/project";

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

const ProjectTimeline = () => {
  const { projectId } = useParams();

  const { loading, error, data } = useQuery(TIMELINE_QUERY, {
    variables: { projectId },
  });

  if (loading) return <CircularProgress />;
  if (error) return `Error! ${error.message}`;

  console.log(data);

  return (
    <CardContent>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Grid container>
            <code>{JSON.stringify(data)}</code>
          </Grid>
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default ProjectTimeline;
