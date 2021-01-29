import React from "react";

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

  /**
   * Queries Hook
   * @type {boolean} - loading state
   * @type {object} - details and messages when there is a query error
   * @type {object} - data returned from Hasura
   * @function refetch - Provides a manual callback to update the Apollo cache
   * */
  const { loading, error, data, refetch } = useQuery(TIMELINE_QUERY, {
    variables: { projectId },
    fetchPolicy: "no-cache",
  });

  // Mutations
  const [updateProjectPhase] = useMutation(UPDATE_PROJECT_PHASES_MUTATION);
  const [deleteProjectPhase] = useMutation(DELETE_PROJECT_PHASE);
  const [addProjectPhase] = useMutation(ADD_PROJECT_PHASE);

  // If the query is loading or data object is undefined,
  // stop here and just render the spinner.
  if (loading || !data) return <CircularProgress />;
  if (error) return `Error! ${error.message}`;

  /**
   * Phase table lookup object formatted into the shape that <MaterialTable>
   * expects.
   * Ex: { construction: "Construction", hold: "Hold", ...}
   */
  const phaseNameLookup = data.moped_phases.reduce(
    (obj, item) =>
      Object.assign(obj, {
        [item.phase_name]:
          item.phase_name.charAt(0).toUpperCase() + item.phase_name.slice(1),
      }),
    {}
  );

  /**
   * Column configuration for <MaterialTable>
   */
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
                      // Merge input fields with required fields default data.
                      const newPhaseObject = Object.assign(
                        {
                          project_id: projectId,
                          completion_percentage: 0,
                          completed: false,
                        },
                        newData
                      );

                      // Execute insert mutation
                      addProjectPhase({
                        variables: {
                          objects: [newPhaseObject],
                        },
                      });
                      setTimeout(() => refetch(), 501);
                      resolve();
                    }, 500);
                  }),
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      const updatedPhaseObject = {
                        ...oldData,
                      };

                      // Array of differences between new and old data
                      let differences = Object.keys(oldData).filter(
                        key => oldData[key] !== newData[key]
                      );

                      // Loop through the differences and assign newData values.
                      // If one of the Date fields is blanked out, coerce empty
                      // string to null.
                      differences.forEach(diff => {
                        let shouldCoerceEmptyStringToNull =
                          newData[diff] === "" &&
                          (diff === "phase_start" || diff === "phase_end");

                        if (shouldCoerceEmptyStringToNull) {
                          updatedPhaseObject[diff] = null;
                        } else {
                          updatedPhaseObject[diff] = newData[diff];
                        }
                      });

                      // Remove extraneous fields given by MaterialTable that
                      // Hasura doesn't need
                      delete updatedPhaseObject.tableData;
                      delete updatedPhaseObject.project_id;
                      delete updatedPhaseObject.__typename;

                      // Execute update mutation
                      updateProjectPhase({
                        variables: updatedPhaseObject,
                      });

                      refetch();
                      resolve();
                    }, 1000);
                  }).then(() => refetch()),
                onRowDelete: oldData =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      // Execute delete mutation
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
