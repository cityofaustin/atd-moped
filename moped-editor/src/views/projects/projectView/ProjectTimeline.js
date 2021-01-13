import React from "react";

// Material
import { makeStyles } from "@material-ui/core";
import {
  Box,
  Button,
  CardContent,
  CircularProgress,
  Grid,
  Icon,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Typography,
} from "@material-ui/core";

// Query
import { TIMELINE_QUERY } from "../../../queries/project";
import { useQuery } from "@apollo/react-hooks";
import { useParams } from "react-router-dom";

const ProjectTimeline = () => {
  const { projectId } = useParams();

  const { loading, error, data } = useQuery(TIMELINE_QUERY, {
    variables: { projectId },
  });

  if (loading) return <CircularProgress />;
  if (error) return `Error! ${error.message}`;

  console.log(data);

  const tableConfig = {
    columns: {
      project_id: {
        label_table: "",
      },
      phase_name: {
        label_table: "Phase Name",
        format: value => value.charAt(0).toUpperCase() + value.slice(1),
      },
      is_current_phase: {
        label_table: "Active?",
      },
      phase_start: {
        label_table: "Start Date",
      },
      phase_end: {
        label_table: "End Date",
      },
    },
  };

  const formatValue = (value, column) => {
    console.log(value, column);
    console.log(tableConfig.columns[column]);
    if (!tableConfig.columns[column].format) return value;

    const formattedValue = tableConfig.columns[column].format(value);
    console.log(formattedValue);
    return formattedValue;
  };

  return (
    <CardContent>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Grid container>
            <Typography>Project Phases</Typography>
            <Table size="small">
              <TableHead>
                {Object.keys(tableConfig.columns).map(column => (
                  <TableCell>
                    {tableConfig.columns[column].label_table}
                  </TableCell>
                ))}
              </TableHead>
              <TableBody>
                {data.moped_proj_phases.map(row => (
                  <TableRow key={row.project_phase_id}>
                    {Object.keys(tableConfig.columns).map(column => (
                      <TableCell>{formatValue(row[column], column)}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button
              color="primary"
              variant="contained"
              // component={RouterLink}
              // to={"/moped/projects/new"}
              startIcon={<Icon>add_circle</Icon>}
            >
              New Phase
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default ProjectTimeline;
