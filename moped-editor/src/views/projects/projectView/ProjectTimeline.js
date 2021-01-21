import React, { useEffect } from "react";

// Material
import { CardContent, CircularProgress, Grid } from "@material-ui/core";
import MaterialTable from "material-table";

// Query
import {
  TIMELINE_QUERY,
  PROJECT_PHASES_MUTATION,
  DELETE_PROJECT_PHASE,
  ADD_PROJECT_PHASE,
} from "../../../queries/project";
import { useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";

const ProjectTimeline = () => {
  const { projectId } = useParams();

  const { loading, error, data, refetch } = useQuery(TIMELINE_QUERY, {
    variables: { projectId },
    fetchPolicy: "no-cache",
  });

  // Mutations
  const [updateProjectPhase] = useMutation(PROJECT_PHASES_MUTATION);
  const [deleteProjectPhase] = useMutation(DELETE_PROJECT_PHASE);
  const [addProjectPhase] = useMutation(ADD_PROJECT_PHASE);

  // useEffect(() => {
  //   refetch();
  // }, [refetch]);

  if (loading) return <CircularProgress />;
  if (error) return `Error! ${error.message}`;

  // console.log("moped_phases", data.moped_phases);
  // debugger;

  const phaseNameLookup = data.moped_phases.reduce(
    (obj, item) =>
      Object.assign(obj, {
        [item.phase_name]:
          item.phase_name.charAt(0).toUpperCase() + item.phase_name.slice(1),
      }),
    {}
  );

  const columns = [
    { title: "Phase Name", field: "phase_name", lookup: phaseNameLookup },
    {
      title: "Active?",
      field: "is_current_phase",
      lookup: { true: "True", false: "False" },
    },
    { title: "Start Date", field: "phase_start" },
    { title: "End Date", field: "phase_end" },
  ];

  // Notes:
  // Update Hasura config so that moped-admin & moped-editor can DELETE
  // `moped_proj_phases`.

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
                // isEditable: rowData => rowData.name === "phase_name",
                onRowAdd: newData =>
                  new Promise((resolve, reject) => {
                    // Merge input fields with required fields
                    const object = Object.assign(
                      {
                        project_id: projectId,
                        completion_percentage: 0,
                        completed: false,
                      },
                      newData
                    );

                    console.log(object);

                    setTimeout(() => {
                      addProjectPhase({
                        variables: {
                          objects: [object],
                        },
                      });
                      resolve();
                    }, 1000);
                  }).then(() => refetch()),
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      let difference = Object.keys(oldData).filter(
                        key => oldData[key] !== newData[key]
                      );

                      if (difference.length < 1) {
                        resolve();
                      }
                      console.log("newData", newData);
                      console.log("oldData", oldData);
                      const leData = Object.assign(newData, oldData);
                      delete leData.tableData;
                      delete leData.project_id;
                      delete leData.__typename;
                      // let leData = {
                      //   project_phase_id: newData.project_phase_id,
                      //   phase_name: newData.phase_name
                      //     ? newData.phase_name
                      //     : oldData.phase_name,
                      // };

                      difference.forEach(diff => {
                        if (diff === "tableData") return;
                        leData[diff] = newData[diff];
                      });

                      console.log("onRowUpdate leData", leData);

                      updateProjectPhase({
                        variables: leData,
                      });
                      resolve();
                    }, 1000);
                  }).then(() => refetch()),
                onRowDelete: oldData =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      deleteProjectPhase({
                        variables: {
                          project_phase_id: oldData.project_phase_id,
                        },
                      });
                      resolve();
                    }, 1000);
                  }).then(() => refetch()),
              }}
            />
          </div>
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default ProjectTimeline;
