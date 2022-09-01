import React from "react";

// Material
import {
  Button,
  CircularProgress,
  Grid,
  TextField,
  Switch,
  Select,
  MenuItem,
  Typography,
  FormControl,
  FormHelperText,
} from "@material-ui/core";
import {
  AddCircle as AddCircleIcon,
  EditOutlined as EditOutlinedIcon,
} from "@material-ui/icons";
import MaterialTable, {
  MTableEditRow,
  MTableAction,
} from "@material-table/core";
import { handleKeyEvent } from "../../../utils/materialTableHelpers";
import typography from "../../../theme/typography";

// Query
import {
  UPDATE_PROJECT_PHASES_MUTATION,
  DELETE_PROJECT_PHASE,
  ADD_PROJECT_PHASE,
  PROJECT_UPDATE_STATUS,
} from "../../../queries/project";
import { PAGING_DEFAULT_COUNT } from "../../../constants/tables";
import { useMutation } from "@apollo/client";
import { format } from "date-fns";
import parseISO from "date-fns/parseISO";

/**
 * ProjectTimeline Component - renders the view displayed when the "Timeline"
 * tab is active
 * @return {JSX.Element}
 * @constructor
 */
const ProjectPhases = ({
  projectId,
  loading,
  data,
  refetch,
  projectViewRefetch,
}) => {
  /** addAction Ref - mutable ref object used to access add action button
   * imperatively.
   * @type {object} addActionRef
   * */
  const addActionRefPhases = React.useRef();

  // Mutations
  const [updateProjectPhase] = useMutation(UPDATE_PROJECT_PHASES_MUTATION);
  const [deleteProjectPhase] = useMutation(DELETE_PROJECT_PHASE);
  const [addProjectPhase] = useMutation(ADD_PROJECT_PHASE);
  const [updateProjectStatus] = useMutation(PROJECT_UPDATE_STATUS);

  // If the query is loading or data object is undefined,
  // stop here and just render the spinner.
  if (loading || !data) return <CircularProgress />;

  /**
   * Direct access to the moped_status array
   */
  const statusMap = data?.moped_status ?? [];

  /**
   * Retrieves the moped_status values from the statusMap array
   * @param {string} status - The name of the status
   * @returns {Object} {status_id: , status_name} or undefined
   */
  const getStatusByPhaseName = (phase_name) =>
    statusMap.find(
      (s) => s.status_name.toLowerCase() === phase_name.toLowerCase()
    );

  /**
   * Phase table lookup object formatted into the shape that Dropdown expects
   * Ex: { 1: "Potential", 2: "Planned", ...}
   */
  const phaseNameLookup = data.moped_phases.reduce(
    (obj, item) =>
      Object.assign(obj, {
        [item.phase_id]: item.phase_name,
      }),
    {}
  );

  /**
   * Subphase table lookup object formatted into the shape that <MaterialTable>
   * expects.
   * Ex: { bid: "Bid", "environmental study": "Environmental Study", ...}
   */
  const subphaseNameLookup = data.moped_subphases.reduce(
    (obj, item) =>
      Object.assign(obj, {
        [item.subphase_id]: item.subphase_name,
      }),
    {}
  );

  /**
   * If phaseObject has is_current_phase === true,
   * set is_current_phase of any other true phases to false
   * to ensure there is only one active phase
   */
  const updateExistingPhases = (phaseObject) => {
    if (phaseObject.is_current_phase) {
      data.moped_proj_phases.forEach((phase) => {
        if (
          phase.is_current_phase &&
          phase.project_phase_id !== phaseObject.project_phase_id
        ) {
          phase.is_current_phase = false;
          // Execute update mutation, returns promise
          return updateProjectPhase({
            variables: phase,
          })
            .then(() => {
              // Refetch data
              refetch();
              projectViewRefetch();
            })
            .catch((err) => {
              console.error(err);
            });
        }
      });
    }
  };

  /**
   * Checks if phase being added or updated has a corresponding status and creates
   * update object accordingly
   * @param {string} mutationPhaseId - phase being added or updated in project phase table
   * @returns {Object} Object that will be used in updates to project status
   */
  const getProjectStatusUpdateObject = (mutationPhaseId) => {
    const newPhaseName = phaseNameLookup[mutationPhaseId];
    const statusMapped = getStatusByPhaseName(newPhaseName);

    return !!statusMapped
      ? {
          // There is a status with same name as phase
          status_id: statusMapped.status_id,
          current_status: statusMapped.status_name.toLowerCase(),
          current_phase: newPhaseName.toLowerCase(),
          current_phase_id: mutationPhaseId,
        }
      : {
          // There isn't a status that matches the phase
          status_id: 1,
          current_status: "active",
          current_phase: newPhaseName.toLowerCase(),
          current_phase_id: mutationPhaseId,
        };
  };

  /**
   * DateFieldEditComponent - renders a Date type Calendar select
   * @param {object} props - Values passed through Material Table `editComponent`
   * @return {JSX.Element}
   * @constructor
   */
  const DateFieldEditComponent = (props) => (
    <TextField
      name={props.name}
      label={props.label}
      type="date"
      variant="standard"
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
      onKeyDown={(e) => handleKeyEvent(e)}
      InputLabelProps={{
        shrink: true,
      }}
    />
  );

  /**
   * ToggleEditComponent - renders a toggle for True/False edit fields
   * @param {object} props - Values passed through Material Table `editComponent`
   * @return {JSX.Element}
   * @constructor
   */
  const ToggleEditComponent = (props) => (
    <Grid component="label" container alignItems="center" spacing={1}>
      <Grid item>
        <Switch
          checked={props.value ?? false}
          onChange={(e) => props.onChange(!props.value)}
          color="primary"
          name={props.name}
          inputProps={{ "aria-label": "primary checkbox" }}
          onKeyDown={(e) => handleKeyEvent(e)}
        />
      </Grid>
    </Grid>
  );

  /**
   * DropDownSelectComponent - Renders a drop down menu for MaterialTable
   * @param {object} props - Values passed through Material Table `editComponent`
   * @param {string} name - Field name
   * @return {JSX.Element}
   * @constructor
   */
  const DropDownSelectComponent = (props) => {
    // If the component name is phase_name, then use phaseNameLookup values, otherwise set as null
    let lookupValues = props.name === "phase_name" ? phaseNameLookup : null;

    // If lookup values is null, then it is a sub-phase list we need to generate
    if (lookupValues === null) {
      // First retrieve the sub-phase id's from moped_phases for that specific row
      const allowedSubphases = props.data.moped_phases.find(
        (item) => item?.phase_id === Number(props.rowData?.phase_id ?? 0)
      )?.moped_subphases;

      // If there are no subphases, hide the drop-down.
      if (!allowedSubphases || allowedSubphases.length === 0) {
        return null;
      }

      // We have a usable array of sub-phase ids, generate lookup values,
      lookupValues = allowedSubphases.reduce((obj, subphase) => {
        obj[subphase.subphase_id] = subphase.subphase_name;
        return obj;
      }, {});
    }

    // empty subphases can show up as 0, this removes warning in console
    lookupValues = { ...lookupValues, 0: "" };

    // Proceed normally and generate the drop-down
    return (
      <FormControl>
        <Select
          id={props.name}
          value={props.value ?? ""}
          style={{ minWidth: "8em" }}
        >
          {Object.keys(lookupValues).map((key) => {
            return (
              <MenuItem
                onChange={() => props.onChange(key)}
                onClick={() => props.onChange(key)}
                onKeyDown={(e) => handleKeyEvent(e)}
                value={key}
                key={key}
              >
                {lookupValues[key]}
              </MenuItem>
            );
          })}
          <MenuItem
            onChange={() => props.onChange("")}
            onClick={() => props.onChange("")}
            onKeyDown={(e) => handleKeyEvent(e)}
            value=""
          >
            -
          </MenuItem>
        </Select>
        {props.name === "phase_name" && (
          <FormHelperText>Required</FormHelperText>
        )}
      </FormControl>
    );
  };

  /**
   * Column configuration for <MaterialTable> Phases table
   */
  const phasesColumns = [
    {
      title: "Phase name",
      field: "phase_id",
      lookup: phaseNameLookup,
      validate: (row) => !!row.phase_id,
      editComponent: (props) => (
        <DropDownSelectComponent {...props} name={"phase_name"} data={data} />
      ),
      width: "18%",
    },
    {
      title: "Sub-phase name",
      field: "subphase_id",
      lookup: subphaseNameLookup,
      editComponent: (props) => (
        <DropDownSelectComponent
          {...props}
          name={"subphase_name"}
          data={data}
        />
      ),
      width: "18%",
    },
    {
      title: "Description",
      field: "phase_description",
      width: "18%",
    },
    {
      title: "Start date",
      field: "phase_start",
      render: (rowData) =>
        rowData.phase_start
          ? format(parseISO(rowData.phase_start), "MM/dd/yyyy")
          : undefined,
      editComponent: (props) => (
        <DateFieldEditComponent
          {...props}
          name="phase_start"
          label="Start Date"
        />
      ),
      width: "18%",
    },
    {
      title: "End date",
      field: "phase_end",
      render: (rowData) =>
        rowData.phase_end
          ? format(parseISO(rowData.phase_end), "MM/dd/yyyy")
          : undefined,
      editComponent: (props) => (
        <DateFieldEditComponent {...props} name="phase_end" label="End Date" />
      ),
      width: "18%",
    },
    {
      title: "Current",
      field: "is_current_phase",
      lookup: { true: "Yes", false: "No" },
      editComponent: (props) => (
        <ToggleEditComponent {...props} name="is_current_phase" />
      ),
      width: "10%",
    },
  ];

  return (
    <MaterialTable
      columns={phasesColumns}
      data={data.moped_proj_phases}
      // Action component customized as described in this gh-issue:
      // https://github.com/mbrn/material-table/issues/2133
      icons={{
        Edit: EditOutlinedIcon,
      }}
      components={{
        EditRow: (props) => (
          <MTableEditRow
            {...props}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                // Bypass default MaterialTable behavior of submitting the entire form when a user hits enter
                // See https://github.com/mbrn/material-table/pull/2008#issuecomment-662529834
              }
            }}
          />
        ),
        Action: (props) => {
          // If isn't the add action
          if (
            typeof props.action === typeof Function ||
            props.action.tooltip !== "Add"
          ) {
            return <MTableAction {...props} />;
          } else {
            return (
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<AddCircleIcon />}
                ref={addActionRefPhases}
                onClick={props.action.onClick}
              >
                Add phase
              </Button>
            );
          }
        },
      }}
      editable={{
        onRowAdd: (newData) => {
          const newPhaseObject = Object.assign(
            {
              project_id: projectId,
              completion_percentage: 0,
              completed: false,
            },
            newData
          );

          // if necessary, updates existing phases in table to ensure only one is marked "current"
          updateExistingPhases(newPhaseObject);

          const projectUpdateInput = getProjectStatusUpdateObject(
            newPhaseObject?.phase_id
          );

          // Execute insert mutation, returns promise
          return addProjectPhase({
            variables: {
              objects: [newPhaseObject],
            },
          })
            .then(() =>
              !!newPhaseObject?.is_current_phase
                ? updateProjectStatus({
                    variables: {
                      projectId: projectId,
                      projectUpdateInput: projectUpdateInput,
                    },
                  })
                : true
            )
            .then(() => {
              // Refetch data
              refetch();
              projectViewRefetch();
            });
        },
        onRowUpdate: (newData, oldData) => {
          const updatedPhaseObject = {
            ...oldData,
          };
          // Array of differences between new and old data
          let differences = Object.keys(oldData).filter(
            (key) => oldData[key] !== newData[key]
          );

          // Loop through the differences and assign newData values.
          // If one of the Date fields is blanked out, coerce empty
          // string to null.
          differences.forEach((diff) => {
            let shouldCoerceEmptyStringToNull =
              newData[diff] === "" &&
              (diff === "phase_start" || diff === "phase_end");

            if (shouldCoerceEmptyStringToNull) {
              updatedPhaseObject[diff] = null;
            } else {
              updatedPhaseObject[diff] = newData[diff];
            }
          });

          // Check if differences include phase_id or is_current_phase
          const existingCurrentPhaseChanged =
            differences.filter((value) => "is_current_phase" === value).length >
            0;

          // We need to know if the updated phase is set as is_current_phase
          const isCurrentPhase = !!newData?.is_current_phase;

          // Remove extraneous fields given by MaterialTable that
          // Hasura doesn't need
          delete updatedPhaseObject.tableData;
          delete updatedPhaseObject.project_id;
          delete updatedPhaseObject.__typename;

          // if necessary, updates existing phases in table to ensure only one is marked "current"
          updateExistingPhases(updatedPhaseObject);

          const mappedProjectUpdateInput = getProjectStatusUpdateObject(
            updatedPhaseObject?.phase_id
          );

          // Execute update mutation, returns promise
          return updateProjectPhase({
            variables: updatedPhaseObject,
          })
            .then(() => {
              // if the phase being updated is toggled as the current phase
              // update moped_project with new current_phase, updating the status badge
              if (isCurrentPhase) {
                return updateProjectStatus({
                  variables: {
                    projectId: projectId,
                    projectUpdateInput: mappedProjectUpdateInput,
                  },
                });
              } else if (existingCurrentPhaseChanged) {
                // if updated phase is not toggled as current phase, but was previously current phase
                // update moped_project with generic current status and current phase
                return updateProjectStatus({
                  variables: {
                    projectId: projectId,
                    projectUpdateInput: {
                      status_id: 1,
                      current_status: "active",
                      current_phase: "active",
                      // we don't have a phase id for active, since it is not an official phase
                      current_phase_id: 0,
                    },
                  },
                });
              }
            })
            .then(() => {
              // Refetch data
              refetch();
              projectViewRefetch();
            });
        },
        onRowDelete: (oldData) => {
          // Execute mutation to set current phase of phase to be deleted to false
          // to ensure summary table stays up to date
          const was_current_phase = !!oldData?.is_current_phase;
          oldData.is_current_phase = false;
          return updateProjectPhase({
            variables: oldData,
          }).then(() => {
            // Execute delete mutation, returns promise
            return deleteProjectPhase({
              variables: {
                project_phase_id: oldData.project_phase_id,
              },
            })
              .then(() =>
                // if the deleted phase was the project's current phase,
                // we need to reset what phase and status are considered "current"
                was_current_phase
                  ? updateProjectStatus({
                      variables: {
                        projectId: projectId,
                        projectUpdateInput: {
                          status_id: 1,
                          current_status: "active",
                          current_phase: "active",
                          // we don't have a phase id for active, since it is not an official phase
                          current_phase_id: 0,
                        },
                      },
                    })
                  : true
              )
              .then(() => {
                refetch();
                projectViewRefetch();
              });
          });
        },
      }}
      title={
        <Typography variant="h2" color="primary">
          Project phases
        </Typography>
      }
      options={{
        ...(data.moped_proj_phases.length < PAGING_DEFAULT_COUNT + 1 && {
          paging: false,
        }),
        search: false,
        rowStyle: { fontFamily: typography.fontFamily },
        actionsColumnIndex: -1,
      }}
      localization={{
        header: {
          actions: "",
        },
        body: {
          emptyDataSourceMessage: (
            <Typography variant="body1">
              No project phases to display
            </Typography>
          ),
        },
      }}
    />
  );
};

export default ProjectPhases;
