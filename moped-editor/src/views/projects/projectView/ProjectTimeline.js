import React, { useState } from "react";

// Material
import {
  CardContent,
  CircularProgress,
  Grid,
  TextField,
} from "@material-ui/core";
import MaterialTable from "material-table";

// Query
import {
  TIMELINE_QUERY,
  UPDATE_PROJECT_PHASES_MUTATION,
  DELETE_PROJECT_PHASE,
  ADD_PROJECT_PHASE,
} from "../../../queries/project";
import { useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";

/**
 * DateFieldEditComponent - renders a Date type Calendar select
 * @param {object} props - Values passed through Material Table `editComponent`
 * @param {string} name - Field name
 * @param {string} label - Display label
 * @return {JSX.Element}
 * @constructor
 */
const DateFieldEditComponent = (props, name, label) => (
  <TextField
    name={name}
    label={label}
    type="date"
    variant="standard"
    value={props.value}
    onChange={e => props.onChange(e.target.value)}
    InputLabelProps={{
      shrink: true,
    }}
  />
);

/**
 * ProjectTimeline Component - renders the view displayed when the "Timeline"
 * tab is active
 * @return {JSX.Element}
 * @constructor
 */
const ProjectTimeline = () => {
  /** Params Hook
   * @type {integer} projectId
   * */
  const { projectId } = useParams();

  //
  /**
   * Queries Hook
   * @type {boolean} loading
   * @type {object} error
   * @type {object} data
   * @function refetch - Provides a manual callback to update the Apollo cache
   * */
  const { loading, error, data, refetch } = useQuery(TIMELINE_QUERY, {
    variables: { projectId },
    fetchPolicy: "no-cache",
  });

  console.log(loading, error, data, refetch);

  // Mutations
  const [updateProjectPhase] = useMutation(UPDATE_PROJECT_PHASES_MUTATION);
  const [deleteProjectPhase] = useMutation(DELETE_PROJECT_PHASE);
  const [addProjectPhase] = useMutation(ADD_PROJECT_PHASE);

  if (loading || !data) return <CircularProgress />;
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
      lookup: { true: "True", false: "False" },
    },
    {
      title: "Start Date",
      field: "phase_start",
      editComponent: props => (
        <DateFieldEditComponent
          {...props}
          name="phase_start"
          label="Start Date"
        />
      ),
    },
    {
      title: "End Date",
      field: "phase_end",
      editComponent: props => (
        <DateFieldEditComponent {...props} name="phase_end" label="End Date" />
      ),
    },
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
                      const leData = { ...oldData };

                      let differences = Object.keys(oldData).filter(
                        key => oldData[key] !== newData[key]
                      );

                      differences.forEach(diff => {
                        if (
                          newData[diff] === "" &&
                          (diff === "phase_start" || diff === "phase_end")
                        ) {
                          leData[diff] = null;
                        } else {
                          leData[diff] = newData[diff];
                        }
                      });

                      delete leData.tableData;
                      delete leData.project_id;
                      delete leData.__typename;

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
