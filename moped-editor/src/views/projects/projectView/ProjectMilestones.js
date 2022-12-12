import React, { useState } from "react";

// Material
import {
  CircularProgress,
  TextField,
  Typography,
  FormControl,
  FormHelperText,
} from "@material-ui/core";
import {
  EditOutlined as EditOutlinedIcon
} from "@material-ui/icons";
import MaterialTable, {
  MTableEditRow,
  MTableAction,
} from "@material-table/core";
import typography from "../../../theme/typography";

// Query
import {
  UPDATE_PROJECT_MILESTONES_MUTATION,
  DELETE_PROJECT_MILESTONE,
  ADD_PROJECT_MILESTONE,
} from "../../../queries/project";
import { useMutation } from "@apollo/client";
import { format } from "date-fns";
import parseISO from "date-fns/parseISO";
import Autocomplete from "@material-ui/lab/Autocomplete";

// Helpers
import { phaseNameLookup } from "src/utils/timelineTableHelpers";
import DateFieldEditComponent from "./DateFieldEditComponent";
import ToggleEditComponent from "./ToggleEditComponent";
import ButtonDropdownMenu from "../../../components/ButtonDropdownMenu";
import MilestoneTemplateModal from "./MilestoneTemplateModal";

/**
 * ProjectMilestones Component - Renders Project Milestone table
 * @return {JSX.Element}
 * @constructor
 */
const ProjectMilestones = ({ projectId, loading, data, refetch }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Mutations
  const [updateProjectMilestone] = useMutation(
    UPDATE_PROJECT_MILESTONES_MUTATION
  );
  const [deleteProjectMilestone] = useMutation(DELETE_PROJECT_MILESTONE);
  const [addProjectMilestone] = useMutation(ADD_PROJECT_MILESTONE);

  // If the query is loading or data object is undefined,
  // stop here and just render the spinner.
  if (loading || !data) return <CircularProgress />;

  /**
   * Milestone table lookup object formatted into the shape that <Autocomplete> expects.
   * Ex: { 1: "Award", 2: "Bid", ...}
   */
  const milestoneNameLookup = data.moped_milestones.reduce(
    (obj, item) =>
      Object.assign(obj, {
        [item.milestone_id]: item.milestone_name,
      }),
    {}
  );

  // Hide Milestone template dialog
  const handleTemplateModalClose = () => {
    setIsDialogOpen(false);
  }

  /**
   * Column configuration for <MaterialTable> Milestones table
   */
  const milestoneColumns = [
    {
      title: "Milestone name",
      field: "milestone_id",
      render: (milestone) => milestone.moped_milestone.milestone_name,
      validate: (milestone) => !!milestone.milestone_id,
      editComponent: (props) => (
        <FormControl style={{ width: "100%" }}>
          <Autocomplete
            id={"milestone_name"}
            name={"milestone_name"}
            options={Object.keys(milestoneNameLookup)}
            getOptionLabel={(option) => milestoneNameLookup[option]}
            getOptionSelected={(option, value) => option === value}
            value={props.value}
            onChange={(event, value) => props.onChange(value)}
            renderInput={(params) => <TextField {...params} />}
          />
          <FormHelperText>Required</FormHelperText>
        </FormControl>
      ),
      width: "25%",
    },
    {
      title: "Description",
      field: "milestone_description",
      render: (milestone) => milestone.milestone_description,
      width: "25%",
    },
    {
      title: "Related phase",
      field: "moped_milestone",
      editable: "never",
      cellStyle: {
        fontFamily: typography.fontFamily,
        fontSize: "14px",
      },
      customSort: (a, b) => {
        const aPhaseName =
          phaseNameLookup(data)[a.moped_milestone.related_phase_id];
        const bPhaseName =
          phaseNameLookup(data)[b.moped_milestone.related_phase_id];
        if (aPhaseName > bPhaseName) {
          return 1;
        }
        if (aPhaseName < bPhaseName) {
          return -1;
        }
        return 0;
      },
      render: (milestone) =>
        phaseNameLookup(data)[milestone.moped_milestone.related_phase_id] ?? "",
      width: "14%",
    },
    {
      title: "Completion estimate",
      field: "milestone_estimate",
      render: (rowData) =>
        rowData.milestone_estimate
          ? format(parseISO(rowData.milestone_estimate), "MM/dd/yyyy")
          : undefined,
      editComponent: (props) => (
        <DateFieldEditComponent
          {...props}
          name="milestone_estimate"
          label="Completion estimate"
        />
      ),
      width: "13%",
    },
    {
      title: "Date completed",
      field: "milestone_end",
      render: (rowData) =>
        rowData.milestone_end
          ? format(parseISO(rowData.milestone_end), "MM/dd/yyyy")
          : undefined,
      editComponent: (props) => (
        <DateFieldEditComponent
          {...props}
          name="milestone_end"
          label="Date completed"
        />
      ),
      width: "13%",
    },
    {
      title: "Complete",
      field: "completed",
      lookup: { true: "Yes", false: "No" },
      editComponent: (props) => (
        <ToggleEditComponent {...props} name="completed" />
      ),
      width: "10%",
    },
  ];

  return (
    <>
    <MaterialTable
      columns={milestoneColumns}
      data={data.moped_proj_milestones}
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
              <ButtonDropdownMenu
                addAction={props.action.onClick}
                openActionDialog={setIsDialogOpen}
                parentButtonText="Add milestone"
                firstOptionText="New milestone"
                secondOptionText="From template"
                secondOptionIcon
              />
            );
          }
        },
      }}
      editable={{
        onRowAdd: (newData) => {
          // Merge input fields with required fields default data.
          const newMilestoneObject = Object.assign(
            {
              project_id: projectId,
              completed: false,
            },
            newData
          );

          // Execute insert mutation
          return addProjectMilestone({
            variables: {
              objects: [newMilestoneObject],
            },
          }).then(() => {
            // Refetch data
            refetch();
          });
        },
        onRowUpdate: (newData, oldData) => {
          const updatedMilestoneObject = {
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
              (diff === "milestone_estimate" || diff === "milestone_end");

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
          return updateProjectMilestone({
            variables: updatedMilestoneObject,
          }).then(() => {
            // Refetch data
            refetch();
          });
        },
        onRowDelete: (oldData) => {
          // Execute delete mutation
          return deleteProjectMilestone({
            variables: {
              project_milestone_id: oldData.project_milestone_id,
            },
          }).then(() => {
            // Refetch data
            refetch();
          });
        },
      }}
      title={
        <Typography variant="h2" color="primary">
          Milestones
        </Typography>
      }
      options={{
        paging: false,
        search: false,
        rowStyle: { fontFamily: typography.fontFamily },
        actionsColumnIndex: -1,
        addRowPosition: 'first',
      }}
      localization={{
        header: {
          actions: "",
        },
        body: {
          emptyDataSourceMessage: (
            <Typography variant="body1">
              No project milestones to display
            </Typography>
          ),
        },
      }}
    />
      <MilestoneTemplateModal
        isDialogOpen={isDialogOpen}
        handleDialogClose={handleTemplateModalClose}
        milestoneNameLookup={milestoneNameLookup}
        selectedMilestones={data.moped_proj_milestones}
        projectId={projectId}
        refetch={refetch}
      />
      </>
  );
};

export default ProjectMilestones;
