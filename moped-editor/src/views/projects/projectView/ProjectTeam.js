import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { useParams } from "react-router-dom";
import {
  Box,
  CardContent,
  CircularProgress,
  Grid,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";

import { TEAM_QUERY } from "../../../queries/projects/projectTeamQuery";

const useStyles = makeStyles(theme => ({
  paper: {
    marginRight: theme.spacing(3),
    padding: theme.spacing(2),
  },
}));

const ProjectTeam = () => {
  const { projectId } = useParams();
  const classes = useStyles();

  const { loading, error, data } = useQuery(TEAM_QUERY, {
    variables: { projectId },
  });

  if (loading) return <CircularProgress />;
  if (error) return `Error! ${error.message}`;

  const team = data.moped_proj_personnel;

  return (
    <CardContent>
      <Grid container spacing={2}>
        {team.length > 0 ? (
          team.map(person => (
            <Paper className={classes.paper}>
              <Typography variant="h2">
                {person.first_name} {person.last_name}
              </Typography>
              <Typography variant="overline">{person.role_name}</Typography>
              <Typography variant="body1">{person.notes}</Typography>
            </Paper>
          ))
        ) : (
          <Box color="text.disabled">
            <Typography>No Project Personnel Data</Typography>
          </Box>
        )}
      </Grid>
    </CardContent>
  );
};

export default ProjectTeam;
