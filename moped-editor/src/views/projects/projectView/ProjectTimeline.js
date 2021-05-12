import React from "react";

// Material
import {
  Box,
  Button,
  CardContent,
  CircularProgress,
  Grid,
  TextField,
  Switch,
} from "@material-ui/core";
import AddBoxIcon from "@material-ui/icons/AddBox";
import MaterialTable, { MTableAction } from "material-table";

// Query
import {
  TIMELINE_QUERY,
  UPDATE_PROJECT_PHASES_MUTATION,
  DELETE_PROJECT_PHASE,
  ADD_PROJECT_PHASE,
  ADD_PROJECT_MILESTONE,
  UPDATE_PROJECT_MILESTONES_MUTATION,
  DELETE_PROJECT_MILESTONE
} from "../../../queries/project";
import { useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import ApolloErrorHandler from "../../../components/ApolloErrorHandler";

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
 * ToggleEditComponent - renders a toggle for True/False edit fields
 * @param {object} props - Values passed through Material Table `editComponent`
 * @param {string} name - Field name
 * @return {JSX.Element}
 * @constructor
 */
const ToggleEditComponent = (props, name) => (
  <Grid component="label" container alignItems="center" spacing={1}>
    <Grid item>
      <Switch
        checked={props.value}
        onChange={e => props.onChange(!props.value)}
        color="primary"
        name={name}
        inputProps={{ "aria-label": "primary checkbox" }}
      />
    </Grid>
  </Grid>
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

  /** addAction Ref - mutable ref object used to access add action button
   * imperatively.
   * @type {object} addActionRef
   * */
  const addActionRefPhases = React.useRef();
  const addActionRefMilestones = React.useRef();

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

  console.log(data);

  // Mutations
  const [updateProjectPhase] = useMutation(UPDATE_PROJECT_PHASES_MUTATION);
  const [deleteProjectPhase] = useMutation(DELETE_PROJECT_PHASE);
  const [addProjectPhase] = useMutation(ADD_PROJECT_PHASE);
  const [addProjectMilestone] = useMutation(ADD_PROJECT_MILESTONE);
  const [updateProjectMilestone] = useMutation(
    UPDATE_PROJECT_MILESTONES_MUTATION
  );
  const [deleteProjectMilestone] = useMutation(DELETE_PROJECT_MILESTONE);

  // If the query is loading or data object is undefined,
  // stop here and just render the spinner.
  if (loading || !data) return <CircularProgress />;

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

  const milestoneNameLookup = data.moped_milestones.reduce((obj, item) =>
    Object.assign(obj, {
      [item.milestone_name]:
        item.milestone_name.charAt(0).toUpperCase() +
        item.milestone_name.slice(1),
    })
  );

  /**
   * Column configuration for <MaterialTable>
   */
  const columns = [
    { title: "Phase Name", field: "phase_name", lookup: phaseNameLookup },
    {
      title: "Active?",
      field: "is_current_phase",
      lookup: { true: "Yes", false: "No" },
      editComponent: props => (
        <ToggleEditComponent {...props} name="is_current_phase" />
      ),
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

  const milestoneColumns = [
    {
      title: "Milestone",
      field: "milestone_name",
      lookup: milestoneNameLookup,
    },
    {
      title: "Description",
      field: "milestone_description",
    },
    {
      title: "Completion estimate",
      field: "milestone_estimate",
      editComponent: props => (
        <DateFieldEditComponent
          {...props}
          name="milestone_estimate"
          label="Completion estimate"
        />
      ),
    },
    {
      title: "Date completed",
      field: "milestone_end",
      editComponent: props => (
        <DateFieldEditComponent
          {...props}
          name="milestone_end"
          label="Date completed"
        />
      ),
    },
    {
      title: "Complete",
      field: "completed",
      lookup: { true: "Yes", false: "No" },
      editComponent: props => (
        <ToggleEditComponent {...props} name="completed" />
      ),
    },
  ];

  return (
    <ApolloErrorHandler error={error}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <div style={{ maxWidth: "100%" }}>
              <MaterialTable
                columns={columns}
                data={data.moped_proj_phases}
                title="Project Phases"
                // Action component customized as described in this gh-issue:
                // https://github.com/mbrn/material-table/issues/2133
                components={{
                  Action: props => {
                    //If isn't the add action
                    if (
                      typeof props.action === typeof Function ||
                      props.action.tooltip !== "Add"
                    ) {
                      return <MTableAction {...props} />;
                    } else {
                      return (
                        <div
                          ref={addActionRefPhases}
                          onClick={props.action.onClick}
                        />
                      );
                    }
                  },
                }}
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
                            status_id: 1,
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

                        setTimeout(() => refetch(), 501);
                        resolve();
                      }, 500);
                    }),
                  onRowDelete: oldData =>
                    new Promise((resolve, reject) => {
                      setTimeout(() => {
                        // Execute delete mutation
                        deleteProjectPhase({
                          variables: {
                            project_phase_id: oldData.project_phase_id,
                          },
                        });
                        setTimeout(() => refetch(), 501);
                        resolve();
                      }, 500);
                    }),
                }}
                options={{
                  actionsColumnIndex: -1,
                }}
              />
            </div>
            <Box pt={2}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<AddBoxIcon />}
                onClick={() => addActionRefPhases.current.click()}
              >
                Add phase
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <div style={{ maxWidth: "100%" }}>
              <MaterialTable
                columns={milestoneColumns}
                data={data.moped_proj_milestones}
                title="Project Milestones"
                components={{
                  Action: props => {
                    //If isn't the add action
                    if (
                      typeof props.action === typeof Function ||
                      props.action.tooltip !== "Add"
                    ) {
                      return <MTableAction {...props} />;
                    } else {
                      return (
                        <div
                          ref={addActionRefMilestones}
                          onClick={props.action.onClick}
                        />
                      );
                    }
                  },
                }}
                editable={{
                  onRowAdd: newData =>
                    new Promise((resolve, reject) => {
                      setTimeout(() => {
                        // Merge input fields with required fields default data.
                        const newMilestoneObject = Object.assign(
                          {
                            project_id: projectId,
                            status_id: 1,
                          },
                          newData
                        );

                        // Execute insert mutation
                        addProjectMilestone({
                          variables: {
                            objects: [newMilestoneObject],
                          },
                        });
                        setTimeout(() => refetch(), 501);
                        resolve();
                      }, 500);
                    }),
                  onRowUpdate: (newData, oldData) =>
                    new Promise((resolve, reject) => {
                      setTimeout(() => {
                        const updatedMilestoneObject = {
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
                            updatedMilestoneObject[diff] = null;
                          } else {
                            updatedMilestoneObject[diff] = newData[diff];
                          }
                        });

                        // Remove extraneous fields given by MaterialTable that
                        // Hasura doesn't need
                        delete updatedMilestoneObject.tableData;
                        delete updatedMilestoneObject.project_id;
                        delete updatedMilestoneObject.__typename;

                        // Execute update mutation
                        updateProjectMilestone({
                          variables: updatedMilestoneObject,
                        });

                        setTimeout(() => refetch(), 501);
                        resolve();
                      }, 500);
                    }),
                  onRowDelete: oldData =>
                    new Promise((resolve, reject) => {
                      setTimeout(() => {
                        // Execute delete mutation
                        deleteProjectMilestone({
                          variables: {
                            project_milestone_id: oldData.project_milestone_id,
                          },
                        });
                        setTimeout(() => refetch(), 501);
                        resolve();
                      }, 500);
                    }),
                }}
                options={{
                  actionsColumnIndex: -1,
                }}
              />
            </div>
            <Box pt={2}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<AddBoxIcon />}
                onClick={() => addActionRefMilestones.current.click()}
              >
                Add milestone
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </ApolloErrorHandler>
  );
};

export default ProjectTimeline;
