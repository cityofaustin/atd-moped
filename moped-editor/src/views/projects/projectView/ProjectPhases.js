import React from "react";

// Material
import { Button, CircularProgress, Typography } from "@material-ui/core";
import {
  AddCircle as AddCircleIcon,
  EditOutlined as EditOutlinedIcon,
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
  PROJECT_UPDATE_STATUS,
} from "../../../queries/project";
import { PAGING_DEFAULT_COUNT } from "../../../constants/tables";
import { useMutation } from "@apollo/client";
import { format } from "date-fns";
import parseISO from "date-fns/parseISO";

// Helpers
import { phaseNameLookup } from "src/utils/timelineTableHelpers";
import DateFieldEditComponent from "./DateFieldEditComponent";
import ToggleEditComponent from "./ToggleEditComponent";
import DropDownSelectComponent from "./DropDownSelectComponent";

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
              !!projectViewRefetch && projectViewRefetch();
            })
            .catch((err) => {
              console.error(err);
            });
        }
      });
    }
  };

  /**
   * Column configuration for <MaterialTable> Phases table
   */
  const phasesColumns = [
    {
      title: "Phase name",
      field: "phase_id",
      lookup: phaseNameLookup(data),
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

          // Execute insert mutation, returns promise
          return addProjectPhase({
            variables: {
              objects: [newPhaseObject],
            },
          }).then(() => {
            // Refetch data
            refetch();
            !!projectViewRefetch && projectViewRefetch();
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

          // Remove extraneous fields given by MaterialTable that
          // Hasura doesn't need
          delete updatedPhaseObject.tableData;
          delete updatedPhaseObject.project_id;
          delete updatedPhaseObject.__typename;

          // if necessary, updates existing phases in table to ensure only one is marked "current"
          updateExistingPhases(updatedPhaseObject);

          // Execute update mutation, returns promise
          return updateProjectPhase({
            variables: updatedPhaseObject,
          }).then(() => {
            // Refetch data
            refetch();
            !!projectViewRefetch && projectViewRefetch();
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
            }).then(() => {
              refetch();
              !!projectViewRefetch && projectViewRefetch();
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
