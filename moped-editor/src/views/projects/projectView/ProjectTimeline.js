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
import { useQuery, useMutation } from "@apollo/react-hooks";
import { useParams } from "react-router-dom";

const ProjectTimeline = () => {
  const { projectId } = useParams();

  const { loading, error, data, refetch } = useQuery(TIMELINE_QUERY, {
    variables: { projectId },
    fetchPolicy: "no-cache",
  });

  const [updateProjectPhase] = useMutation(PROJECT_PHASES_MUTATION);
  const [deleteProjectPhase] = useMutation(DELETE_PROJECT_PHASE);
  const [addProjectPhase] = useMutation(ADD_PROJECT_PHASE);

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (loading) return <CircularProgress />;
  if (error) return `Error! ${error.message}`;

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
                    setTimeout(() => {
                      addProjectPhase({
                        variables: {
                          objects: [
                            {
                              phase_name: newData.phase_name,
                              completion_percentage:
                                newData.completion_percentage || 0,
                              completed: newData.completed || false,
                              project_id: projectId,
                            },
                          ],
                        },
                      });
                      refetch();
                      resolve();
                    }, 1000);
                  }),
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      let difference = Object.keys(oldData).filter(
                        key => oldData[key] !== newData[key]
                      );

                      if (difference.length < 1) {
                        resolve();
                      }

                      let leData = {
                        project_phase_id: newData.project_phase_id,
                        phase_name: newData.phase_name
                          ? newData.phase_name
                          : oldData.phase_name,
                      };

                      difference.forEach(diff => {
                        if (diff === "tableData") return;
                        leData[diff] = newData[diff];
                      });

                      updateProjectPhase({
                        variables: leData,
                      });
                      refetch();
                      resolve();
                    }, 1000);
                  }),
                onRowDelete: oldData =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      deleteProjectPhase({
                        variables: {
                          project_phase_id: oldData.project_phase_id,
                        },
                      });
                      refetch();
                      resolve();
                    }, 1000);
                  }),
              }}
            />
          </div>
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default ProjectTimeline;
