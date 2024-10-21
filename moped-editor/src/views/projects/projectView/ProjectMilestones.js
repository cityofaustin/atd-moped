import React, { useState, useEffect, useMemo } from "react";

import {
  CircularProgress,
  TextField,
  Typography,
  FormControl,
  FormHelperText,
} from "@mui/material";
import {
  EditOutlined as EditOutlinedIcon,
  DeleteOutline as DeleteOutlineIcon,
} from "@mui/icons-material";
import MaterialTable, {
  MTableEditRow,
  MTableAction,
  MTableToolbar,
} from "@material-table/core";
import typography from "../../../theme/typography";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {
  DataGridPro,
  GridRowModes,
  GridActionsCellItem,
  useGridApiRef,
  // gridStringOrNumberComparator,
} from "@mui/x-data-grid-pro";
import dataGridProStyleOverrides from "src/styles/dataGridProStylesOverrides";
import ProjectMilestoneToolbar from "./ProjectMilestones/ProjectMilestoneToolbar";

// Query
import {
  UPDATE_PROJECT_MILESTONES_MUTATION,
  DELETE_PROJECT_MILESTONE,
  ADD_PROJECT_MILESTONE,
} from "../../../queries/project";
import { useMutation } from "@apollo/client";
import { format } from "date-fns";
import parseISO from "date-fns/parseISO";
import Autocomplete from "@mui/material/Autocomplete";

// Helpers
import { phaseNameLookup } from "src/utils/timelineTableHelpers";
import DateFieldEditComponent from "./DateFieldEditComponent";
import ToggleEditComponent from "./ToggleEditComponent";
import ButtonDropdownMenu from "../../../components/ButtonDropdownMenu";
import MilestoneTemplateModal from "./ProjectMilestones/MilestoneTemplateModal";

const useColumns = ({
  // classes,
  data,
  rowModesModel,
  // handleEditClick,
  // handleSaveClick,
  // handleCancelClick,
  // handleDeleteOpen,
}) =>
  useMemo(() => {
    return [
      {
        headerName: "Milestone",
        field: "milestone_id",
        renderCell: ({ row }) => row.moped_milestone.milestone_name,
        // input validation:
        preProcessEditCellProps: (milestone) => !!milestone.milestone_id,
        // editComponent: (props) => (
        //   <FormControl variant="standard" style={{ width: "100%" }}>
        //     <Autocomplete
        //       id={"milestone_name"}
        //       name={"milestone_name"}
        //       options={Object.keys(milestoneNameLookup)}
        //       getOptionLabel={(option) => milestoneNameLookup[option]}
        //       isOptionEqualToValue={(option, value) => option === value}
        //       value={props.value}
        //       onChange={(event, value) => props.onChange(value)}
        //       renderInput={(params) => (
        //         <TextField variant="standard" {...params} />
        //       )}
        //     />
        //     <FormHelperText>Required</FormHelperText>
        //   </FormControl>
        // ),
        width: 175,
      },
      {
        headerName: "Description",
        field: "description",
        width: 200,
        editable: true,
      },
      {
        headerName: "Related phase",
        field: "moped_milestone",
        editable: false,
        // cellStyle: {
        //   fontFamily: typography.fontFamily,
        //   fontSize: "14px",
        // },
        // customSort: (a, b) => {
        //   const aPhaseName =
        //     phaseNameLookup(data)[a.moped_milestone.related_phase_id];
        //   const bPhaseName =
        //     phaseNameLookup(data)[b.moped_milestone.related_phase_id];
        //   if (aPhaseName > bPhaseName) {
        //     return 1;
        //   }
        //   if (aPhaseName < bPhaseName) {
        //     return -1;
        //   }
        //   return 0;
        // },
        valueGetter: (value) => {
          return phaseNameLookup(data)[value.related_phase_id] ?? "";
        },
        width: 150,
      },
      {
        headerName: "Completion estimate",
        field: "date_estimate",
        valueFormatter: (value) =>
          value ? format(parseISO(value), "MM/dd/yyyy") : undefined,
        // editComponent: (props) => (
        //   <DateFieldEditComponent
        //     {...props}
        //     name="date_estimate"
        //     label="Completion estimate"
        //   />
        // ),
        width: 175,
      },
      {
        headerName: "Date completed",
        field: "date_actual",
        valueFormatter: (value) =>
          value ? format(parseISO(value), "MM/dd/yyyy") : undefined,
        // editComponent: (props) => (
        //   <DateFieldEditComponent
        //     {...props}
        //     name="date_actual"
        //     label="Date (actual)"
        //   />
        // ),
        width: 175,
      },
      {
        headerName: "Complete",
        field: "completed",
        valueFormatter: (value) =>  (!!value  ? "Yes" : "No"), 
        // lookup: { true: "Yes", false: "No" },
        // editComponent: (props) => (
        //   <ToggleEditComponent {...props} name="completed" />
        // ),
        // width: "10%",
        width: 150,
      },
      {
        headerName: "",
        field: "edit",
        hideable: false,
        filterable: false,
        sortable: false,
        editable: false,
        type: "actions",
        getActions: ({ id }) => {
          const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
          if (isInEditMode) {
            return [
              <GridActionsCellItem
                icon={<CheckIcon sx={{ fontSize: "24px" }} />}
                label="Save"
                sx={{
                  color: "primary.main",
                }}
                //onClick={handleSaveClick(id)}
              />,
              <GridActionsCellItem
                icon={<CloseIcon sx={{ fontSize: "24px" }} />}
                label="Cancel"
                className="textPrimary"
                //onClick={handleCancelClick(id)}
                color="inherit"
              />,
            ];
          }
          return [
            <GridActionsCellItem
              icon={<EditOutlinedIcon sx={{ fontSize: "24px" }} />}
              label="Edit"
              className="textPrimary"
              //onClick={handleEditClick(id)}
              color="inherit"
            />,
            <GridActionsCellItem
              icon={<DeleteOutlineIcon sx={{ fontSize: "24px" }} />}
              label="Delete"
              //onClick={() => handleDeleteOpen(id)}
              color="inherit"
            />,
          ];
        },
      },
    ];
  }, [
    // classes,
    data,
    rowModesModel,
    // handleSaveClick,
    // handleCancelClick,
    // handleEditClick,
    // handleDeleteOpen,
  ]);
/**
 * ProjectMilestones Component - Renders Project Milestone table
 * @return {JSX.Element}
 * @constructor
 */
const ProjectMilestones = ({ projectId, loading, data, refetch }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const apiRef = useGridApiRef();

  // Mutations
  const [updateProjectMilestone] = useMutation(
    UPDATE_PROJECT_MILESTONES_MUTATION
  );
  const [deleteProjectMilestone] = useMutation(DELETE_PROJECT_MILESTONE);
  const [addProjectMilestone] = useMutation(ADD_PROJECT_MILESTONE);

  // rows and rowModesModel used in DataGrid
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});

  useEffect(() => {
    if (data && data.moped_proj_milestones.length > 0) {
      setRows(data.moped_proj_milestones);
    }
  }, [data]);

  const onClickAddMilestone = () => console.log("hi"); // setEditPhase({ project_id: projectId });

  const dataGridColumns = useColumns({
    // classes,
    data,
    rowModesModel,
    // handleDeleteOpen,
    // handleSaveClick,
    // handleCancelClick,
    // handleEditClick,
    // validateFileInput,
  });

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
  };

  /**
   * Column configuration for <MaterialTable> Milestones table
   */
  const milestoneColumns = [
    {
      title: "Milestone",
      field: "milestone_id",
      render: (milestone) => milestone.moped_milestone.milestone_name,
      validate: (milestone) => !!milestone.milestone_id,
      editComponent: (props) => (
        <FormControl variant="standard" style={{ width: "100%" }}>
          <Autocomplete
            id={"milestone_name"}
            name={"milestone_name"}
            options={Object.keys(milestoneNameLookup)}
            getOptionLabel={(option) => milestoneNameLookup[option]}
            isOptionEqualToValue={(option, value) => option === value}
            value={props.value}
            onChange={(event, value) => props.onChange(value)}
            renderInput={(params) => (
              <TextField variant="standard" {...params} />
            )}
          />
          <FormHelperText>Required</FormHelperText>
        </FormControl>
      ),
      width: "25%",
    },
    {
      title: "Description",
      field: "description",
      render: (milestone) => milestone.description,
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
      field: "date_estimate",
      render: (rowData) =>
        rowData.date_estimate
          ? format(parseISO(rowData.date_estimate), "MM/dd/yyyy")
          : undefined,
      editComponent: (props) => (
        <DateFieldEditComponent
          {...props}
          name="date_estimate"
          label="Completion estimate"
        />
      ),
      width: "13%",
    },
    {
      title: "Date completed",
      field: "date_actual",
      render: (rowData) =>
        rowData.date_actual
          ? format(parseISO(rowData.date_actual), "MM/dd/yyyy")
          : undefined,
      editComponent: (props) => (
        <DateFieldEditComponent
          {...props}
          name="date_actual"
          label="Date (actual)"
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
        icons={{ Delete: DeleteOutlineIcon, Edit: EditOutlinedIcon }}
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
          Toolbar: (props) => (
            // to have it align with table content
            <div style={{ marginLeft: "-10px" }}>
              <MTableToolbar {...props} />
            </div>
          ),
        }}
        editable={{
          onRowAdd: (newData) => {
            // Merge input fields with required fields default data.
            const newMilestoneObject = {
              project_id: projectId,
              completed: false,
              ...newData,
            };

            // Coerce empty strings to null
            Object.keys(newMilestoneObject).forEach((key) => {
              if (newMilestoneObject[key] === "") {
                newMilestoneObject[key] = null;
              }
            });

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
              ...newData,
            };

            // Coerce empty strings to null
            Object.keys(updatedMilestoneObject).forEach((key) => {
              if (updatedMilestoneObject[key] === "") {
                updatedMilestoneObject[key] = null;
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
          addRowPosition: "first",
          idSynonym: "project_milestone_id",
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
      <DataGridPro
        sx={dataGridProStyleOverrides}
        apiRef={apiRef}
        ref={apiRef}
        autoHeight
        columns={dataGridColumns}
        rows={rows}
        getRowId={(row) => row.project_milestone_id}
        editMode="row"
        rowModesModel={rowModesModel}
        // onRowModesModelChange={handleRowModesModelChange}
        // processRowUpdate={processRowUpdate}
        // onProcessRowUpdateError={handleProcessUpdateError}
        disableRowSelectionOnClick
        toolbar
        density="comfortable"
        getRowHeight={() => "auto"}
        hideFooter
        localeText={{ noRowsLabel: "No project milestones to display" }}
        initialState={{ pinnedColumns: { right: ["edit"] } }}
        slots={{
          toolbar: ProjectMilestoneToolbar,
        }}
        slotProps={{
          toolbar: {
            addAction: onClickAddMilestone,
            setIsDialogOpen: setIsDialogOpen,
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
