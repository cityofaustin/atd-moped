import React, { useState } from "react";

// Material
import {
  CircularProgress,
  Typography,
  FormControl,
  FormHelperText,
  TextField,
  Box,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { green } from "@mui/material/colors";

import {
  EditOutlined as EditOutlinedIcon,
  DeleteOutline as DeleteOutlineIcon,
  CheckCircleOutline,
} from "@mui/icons-material";
import MaterialTable, {
  MTableEditRow,
  MTableAction,
  MTableToolbar,
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

import DateFieldEditComponent from "./DateFieldEditComponent";
import ToggleEditComponent from "./ToggleEditComponent";
import DropDownSelectComponent from "./DropDownSelectComponent";
import ButtonDropdownMenu from "../../../components/ButtonDropdownMenu";
import PhaseTemplateModal from "./PhaseTemplateModal";

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
 * ProjectPhases Component - renders Project Phase table
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
  const [isMutating, setIsMutating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Mutations
  const [updateProjectPhase] = useMutation(UPDATE_PROJECT_PHASES_MUTATION);
  const [clearCurrentProjectPhases] = useMutation(
    CLEAR_CURRENT_PROJECT_PHASES_MUTATION
  );
  const [deleteProjectPhase] = useMutation(DELETE_PROJECT_PHASE);
  const [addProjectPhase] = useMutation(ADD_PROJECT_PHASE);

  // Dropdown options
  const phaseOptions = data?.moped_phases || [];

  // Hide Phase template dialog
  const handleTemplateModalClose = () => {
    setIsDialogOpen(false);
  };

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

  const phaseNameLookup = data.moped_phases.reduce(
    (obj, item) =>
      Object.assign(obj, {
        [item.phase_id]: item.phase_name,
      }),
    {}
  );

  const subphaseNameLookup = data.moped_subphases.reduce(
    (obj, item) =>
      Object.assign(obj, {
        [item.subphase_id]: item.subphase_name,
      }),
    {}
  );

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
        <FormControl variant="standard" style={{ minWidth: 150 }}>
          <Autocomplete
            id="phase_id_autocomplete"
            name="phase_id_autocomplete"
            options={phaseOptions}
            getOptionLabel={(phase) => phase.phase_name}
            isOptionEqualToValue={(option, value) =>
              option.phase_id === value.phase_id
            }
            value={props.value || null}
            onChange={(event, value) => {
              return props.onChange(value);
            }}
            renderInput={(params) => (
              <TextField
                variant="standard"
                {...params}
                autoFocus
                style={{ minWidth: 200 }}
              />
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
      editComponent: (props) => <DateFieldEditComponent {...props} />,
      width: "10%",
    },
    {
      title: "End",
      field: "phase_end",
      render: (rowData) =>
        rowData.phase_end
          ? format(parseISO(rowData.phase_end), "MM/dd/yyyy")
          : undefined,
      editComponent: (props) => <DateFieldEditComponent {...props} />,
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
    <>
      <MaterialTable
        isLoading={isMutating}
        columns={phasesColumns}
        data={data.moped_proj_phases}
        icons={{ Delete: DeleteOutlineIcon, Edit: EditOutlinedIcon }}
        // Action component customized as described in this gh-issue:
        // https://github.com/mbrn/material-table/issues/2133
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
                <ButtonDropdownMenu
                  addAction={props.action.onClick}
                  openActionDialog={setIsDialogOpen}
                  parentButtonText="Add phase"
                  firstOptionText="New phase"
                  secondOptionText="From template"
                  secondOptionIcon
                />
              );
            }
          },
          Toolbar: (props) => (
            // to have it align with table content
            <div style={{ marginLeft: "-10px" }}>
              <MTableToolbar {...props} />
            </div>
          ),
        }}
        editable={{
          onRowAdd: async (newData) => {
            setIsMutating(true);
            const { moped_phase, ...rest } = newData;

            const newPhasePayload = {
              project_id: projectId,
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

            // Remove extraneous fields given by MaterialTable that
            // Hasura doesn't need
            delete updatedPhasePayload.tableData;

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
          addRowPosition: "first",
          idSynonym: "project_phase_id",
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
      <PhaseTemplateModal
        isDialogOpen={isDialogOpen}
        handleDialogClose={handleTemplateModalClose}
        selectedPhases={data.moped_proj_phases}
        phaseNameLookup={phaseNameLookup}
        subphaseNameLookup={subphaseNameLookup}
        projectId={projectId}
        refetch={refetch}
      />
    </>
  );
};

export default ProjectPhases;
