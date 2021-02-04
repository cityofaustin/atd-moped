import React from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

// Material
import {
  CardContent,
  CircularProgress,
  Grid,
  TextField,
} from "@material-ui/core";
import MaterialTable from "material-table";

import { TEAM_QUERY } from "../../../queries/project";

const ProjectTeam = () => {
  const { projectId } = useParams();

  const { loading, error, data, refetch } = useQuery(TEAM_QUERY, {
    variables: { projectId },
    fetchPolicy: "no-cache",
  });

  console.log(data);

  if (loading || !data) return <CircularProgress />;
  if (error) return `Error! ${error.message}`;

  const team = data.moped_proj_personnel;

  /**
   * Column configuration for <MaterialTable>
   */
  const columns = [
    {
      title: "Name",
      field: "first_name",
      // lookup: phaseNameLookup
    },
    {
      title: "Role",
      field: "role_name",
      // lookup: { true: "True", false: "False" },
    },
    {
      title: "Workgroup",
      field: "workgroup_id",
      // editComponent: props => (
      //   <DateFieldEditComponent
      //     {...props}
      //     name="phase_start"
      //     label="Start Date"
      //   />
      // ),
    },
    {
      title: "Notes",
      field: "notes",
      editComponent: props => (
        <TextField
          name="Notes"
          style={{ width: 250, paddingLeft: 10 }}
          multiline
          inputProps={{ maxLength: 75 }}
          variant="outlined"
          helperText="75 character max"
          value={""}
          // onChange={e => handleNoteChange(e.target.value, index)}
        />
      ),
    },
  ];

  return (
    <CardContent>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div style={{ maxWidth: "100%" }}>
            <MaterialTable
              columns={columns}
              data={team}
              title="Project Team"
              options={{
                search: false,
              }}
              editable={{
                onRowAdd: newData =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      // Add team member

                      setTimeout(() => refetch(), 501);
                      resolve();
                    }, 500);
                  }),
                // onRowUpdate: (newData, oldData) =>
                //   new Promise((resolve, reject) => {
                //     setTimeout(() => {
                //       // Update team member

                //       setTimeout(() => refetch(), 501);
                //       resolve();
                //     }, 500);
                //   }),
                // onRowDelete: oldData =>
                //   new Promise((resolve, reject) => {
                //     setTimeout(() => {
                //       // Execute delete mutation

                //       setTimeout(() => refetch(), 501);
                //       resolve();
                //     }, 500);
                //   }),
              }}
            />
          </div>
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default ProjectTeam;
