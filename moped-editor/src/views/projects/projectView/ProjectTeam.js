import React from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

// Material
import { CardContent, CircularProgress, Grid } from "@material-ui/core";
import MaterialTable from "material-table";

import { TEAM_QUERY } from "../../../queries/project";

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
        <Grid item xs={12}>
          <div style={{ maxWidth: "100%" }}>
            <MaterialTable
              columns={columns}
              data={data.moped_proj_phases}
              title="Project Phases"
              editable={{
                onRowAdd: newData =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      // Add team member

                      setTimeout(() => refetch(), 501);
                      resolve();
                    }, 500);
                  }),
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      // Update team member

                      setTimeout(() => refetch(), 501);
                      resolve();
                    }, 500);
                  }),
                onRowDelete: oldData =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      // Execute delete mutation

                      setTimeout(() => refetch(), 501);
                      resolve();
                    }, 500);
                  }),
              }}
            />
          </div>
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default ProjectTeam;
