import React from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

// Material
import { CardContent, CircularProgress, Grid } from "@material-ui/core";
import MaterialTable from "material-table";

import { TEAM_QUERY } from "../../../queries/project";

const ProjectTeam = () => {
  const { projectId } = useParams();
  console.log(projectId);

  const { loading, error, data, refetch } = useQuery(TEAM_QUERY, {
    variables: { projectId },
  });

  if (loading) return <CircularProgress />;
  if (error) return `Error! ${error.message}`;

  const team = data.moped_proj_personnel;

  /**
   * Column configuration for <MaterialTable>
   */
  const columns = [
    // { title: "Phase Name", field: "phase_name", lookup: phaseNameLookup },
    // {
    //   title: "Active?",
    //   field: "is_current_phase",
    //   lookup: { true: "True", false: "False" },
    // },
    // {
    //   title: "Start Date",
    //   field: "phase_start",
    //   editComponent: props => (
    //     <DateFieldEditComponent
    //       {...props}
    //       name="phase_start"
    //       label="Start Date"
    //     />
    //   ),
    // },
    // {
    //   title: "End Date",
    //   field: "phase_end",
    //   editComponent: props => (
    //     <DateFieldEditComponent {...props} name="phase_end" label="End Date" />
    //   ),
    // },
  ];

  return (
    <CardContent>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div style={{ maxWidth: "100%" }}>
            <MaterialTable
              columns={columns}
              data={team}
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
