import React, { useState } from "react";

// Material
import {
  Button,
  CircularProgress,
  Typography,
  FormControl,
  FormHelperText,
  TextField,
  Box,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { green } from "@material-ui/core/colors";

import {
  AddCircle as AddCircleIcon,
  EditOutlined as EditOutlinedIcon,
  CheckCircleOutline,
} from "@material-ui/icons";
import MaterialTable, {
  MTableEditRow,
  MTableAction,
} from "@material-table/core";
import typography from "../../../theme/typography";

// Query
import {
  UPDATE_PROJECT_PHASES_MUTATION,
  DELETE_PROJECT_PHASE,
  ADD_PROJECT_PHASE,
  CLEAR_CURRENT_PROJECT_PHASES_MUTATION,
} from "../../../queries/project";
import { PAGING_DEFAULT_COUNT } from "../../../constants/tables";
import { useMutation } from "@apollo/client";
import { format } from "date-fns";
import parseISO from "date-fns/parseISO";

// Helpers
import DateFieldEditComponent from "./DateFieldEditComponent";
import ToggleEditComponent from "./ToggleEditComponent";
import DropDownSelectComponent from "./DropDownSelectComponent";

/**
 * Identify any current moped_proj_phases
 * @param {Int} newCurrentPhaseId - the ID of the phase that should be marked as current - optional
 * @param {Array} existingProjPhases - array of this project's moped_proj_phases
 * @return {Array} array of moped_proj_phases.project_phase_id primary keys
 */
const getCurrentPhaseIDs = (newCurrentPhaseId, existingProjPhases) =>
  existingProjPhases
    .filter(
      ({ is_current_phase, project_phase_id }) =>
        is_current_phase && project_phase_id !== newCurrentPhaseId
    )
    .map(({ project_phase_id }) => project_phase_id);

/**
 * Replace all object properties which are empty strings "" with null
 */
const replaceEmptyStrings = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === "") {
      obj[key] = null;
    }
  });
};

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

  const [isMutating, setIsMutating] = useState(false);

  // Mutations
  const [updateProjectPhase] = useMutation(UPDATE_PROJECT_PHASES_MUTATION);
  const [clearCurrentProjectPhases] = useMutation(
    CLEAR_CURRENT_PROJECT_PHASES_MUTATION
  );
  const [deleteProjectPhase] = useMutation(DELETE_PROJECT_PHASE);
  const [addProjectPhase] = useMutation(ADD_PROJECT_PHASE);

  // Dropdown options
  const phaseOptions = data?.moped_phases || [];

  // If the query is loading or data object is undefined,
  // stop here and just render the spinner.
  if (loading || !data) return <CircularProgress />;

  /**
   * Set is_current_phase of all proj phases except currentPhaseId to false
   * to ensure there is only one active phase
   */
  const updateExistingPhases = async (projPhasesIdsToUpdate) => {
    // Execute update mutation
    // We bundle all phases into this single mutation so that it can be cleanly awaited
    await clearCurrentProjectPhases({
      variables: { ids: projPhasesIdsToUpdate },
    }).catch((err) => {
      console.error(err);
    });
  };

  /**
   * Column configuration for <MaterialTable> Phases table
   */
  const phasesColumns = [
    {
      title: "Phase",
      field: "moped_phase",
      validate: (row) => !!row.moped_phase?.phase_id,
      render: (row) => row.moped_phase?.phase_name,
      editComponent: (props) => (
        <FormControl style={{ minWidth: 150 }}>
          <Autocomplete
            id="phase_id_autocomplete"
            name="phase_id_autocomplete"
            options={phaseOptions}
            getOptionLabel={(phase) => phase.phase_name}
            getOptionSelected={(option, value) =>
              option.phase_id === value.phase_id
            }
            value={props.value || null}
            onChange={(event, value) => {
              return props.onChange(value);
            }}
            renderInput={(params) => (
              <TextField {...params} autoFocus style={{ minWidth: 200 }} />
            )}
          />
          <FormHelperText>Required</FormHelperText>
        </FormControl>
      ),
      width: "25%",
    },
    {
      title: "Subphase",
      field: "subphase_id",
      render: (rowData) => rowData.moped_subphase?.subphase_name,
      editComponent: (props) => (
        <DropDownSelectComponent
          {...props}
          name={"subphase_name"}
          data={data}
        />
      ),
      width: "20%",
    },
    {
      title: "Description",
      field: "phase_description",
      width: "25%",
    },
    {
      title: "Start",
      field: "phase_start",
      render: (rowData) =>
        rowData.phase_start
          ? format(parseISO(rowData.phase_start), "MM/dd/yyyy")
          : undefined,
      editComponent: (props) => (
        <DateFieldEditComponent {...props} name="phase_start" label="Start" />
      ),
      width: "10%",
    },
    {
      title: "End",
      field: "phase_end",
      render: (rowData) =>
        rowData.phase_end
          ? format(parseISO(rowData.phase_end), "MM/dd/yyyy")
          : undefined,
      editComponent: (props) => (
        <DateFieldEditComponent {...props} name="phase_end" label="End" />
      ),
      width: "10%",
    },
    {
      title: "Current",
      field: "is_current_phase",
      lookup: { true: "Yes", false: "No" },
      render: (rowData) =>
        rowData.is_current_phase ? (
          <Box display="flex">
            <CheckCircleOutline style={{ color: green[500] }} />
            <span style={{ paddingInlineStart: ".25rem" }}>Yes</span>
          </Box>
        ) : (
          ""
        ),
      editComponent: (props) => (
        <ToggleEditComponent {...props} name="is_current_phase" />
      ),
      width: "10%",
    },
  ];

  return (
    <MaterialTable
      isLoading={isMutating}
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
        onRowAdd: async (newData) => {
          setIsMutating(true);
          const { moped_phase, ...rest } = newData;

          const newPhasePayload = {
            project_id: projectId,
            completion_percentage: 0,
            completed: false,
            phase_id: moped_phase.phase_id,
            ...rest,
          };

          replaceEmptyStrings(newPhasePayload);

          // if necessary, updates existing phases in table to ensure only one is marked "current"
          if (newPhasePayload.is_current_phase) {
            const projPhasesIdsToUpdate = getCurrentPhaseIDs(
              null,
              data.moped_proj_phases
            );
            if (projPhasesIdsToUpdate.length > 0) {
              await updateExistingPhases(projPhasesIdsToUpdate);
            }
          }

          // Execute insert mutation, returns promise
          await addProjectPhase({
            variables: {
              objects: [newPhasePayload],
            },
          }).catch((err) => {
            console.error(err);
          });
          // Refetch data
          await refetch();
          if (!!projectViewRefetch) {
            await projectViewRefetch();
          }
          setIsMutating(false);
        },
        onRowUpdate: async (newData, oldData) => {
          setIsMutating(true);
          const {
            project_phase_id,
            moped_phase,
            moped_subphase,
            __typename,
            ...updatedPhasePayload
          } = newData;
          // extract phase_id from moped_phase object
          updatedPhasePayload.phase_id = moped_phase.phase_id;

          replaceEmptyStrings(updatedPhasePayload);

          // if necessary, updates existing phases in table to ensure only one is marked "current"
          if (updatedPhasePayload.is_current_phase) {
            const projPhasesIdsToUpdate = getCurrentPhaseIDs(
              project_phase_id,
              data.moped_proj_phases
            );
            if (projPhasesIdsToUpdate.length > 0) {
              await updateExistingPhases(projPhasesIdsToUpdate);
            }
          }

          // Execute update mutation
          await updateProjectPhase({
            variables: { project_phase_id, object: updatedPhasePayload },
          }).catch((err) => {
            console.error(err);
          });
          // Refetch data
          await refetch();

          if (!!projectViewRefetch) {
            await projectViewRefetch();
          }
          setIsMutating(false);
        },
        onRowDelete: async (oldData) => {
          // Execute delete mutation
          setIsMutating(true);
          await deleteProjectPhase({
            variables: {
              project_phase_id: oldData.project_phase_id,
            },
          }).catch((err) => {
            console.error(err);
          });
          await refetch();

          if (!!projectViewRefetch) {
            await projectViewRefetch();
          }
          setIsMutating(false);
        },
      }}
      title={
        <Typography variant="h2" color="primary">
          Phases
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
