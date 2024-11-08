import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery, useMutation } from "@apollo/client";

import {
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  TextField,
  Typography,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {
  AddCircle as AddCircleIcon,
  DeleteOutline as DeleteOutlineIcon,
  EditOutlined as EditOutlinedIcon,
} from "@mui/icons-material";
import {
  DataGridPro,
  GridRowModes,
  GridActionsCellItem,
  useGridApiContext,
} from "@mui/x-data-grid-pro";
import dataGridProStyleOverrides from "src/styles/dataGridProStylesOverrides";
import { v4 as uuidv4 } from "uuid";
import SubprojectsToolbar from "./SubprojectsToolbar";
import Autocomplete from "@mui/material/Autocomplete";
// import MaterialTable, {
//   MTableAction,
//   MTableToolbar,
// } from "@material-table/core";
import ApolloErrorHandler from "../../../../components/ApolloErrorHandler";
import ProjectStatusBadge from "../../projectView/ProjectStatusBadge";
import RenderFieldLink from "../../../../components/RenderFieldLink";
import SubprojectLookupComponent from "./SubprojectLookupComponent";

import {
  SUBPROJECT_QUERY,
  UPDATE_PROJECT_SUBPROJECT,
  DELETE_PROJECT_SUBPROJECT,
} from "../../../../queries/subprojects";
import typography from "../../../../theme/typography";

/** Hook that provides memoized column settings */
const useColumns = ({
  data,
  rowModesModel,
  handleDeleteOpen,
  handleSaveClick,
  handleCancelClick,
  handleEditClick,
}) =>
  useMemo(() => {
    console.log(data);
    return [
      {
        headerName: "ID",
        field: "project_id",
        editable: false,
        width: 50,
      },
      {
        headerName: "Full name",
        field: "project_name_full",
        editable: true,
        width: 350,
        renderEditCell: (props) => (
          <SubprojectLookupComponent {...props} data={data} />
        ),
        // validate: (entry) => !!entry.project_name_full,
        // render: (entry) => (
        //   <RenderFieldLink
        //     projectId={entry.project_id}
        //     value={entry.project_name_full}
        //   />
        // ),
        // editComponent: (props) => (
        //   <FormControl variant="standard" style={{ width: "100%" }}>
        //     <Autocomplete
        //       id="project_name"
        //       name="project_name"
        //       options={data.subprojectOptions}
        //       getOptionLabel={(option) =>
        //         `${option.project_id} - ${option.project_name_full}`
        //       }
        //       value={props.value || null}
        //       onChange={(event, value) => props.onChange(value)}
        //       renderInput={(params) => (
        //         <TextField variant="standard" {...params} />
        //       )}
        //     />
        //     <FormHelperText>Required</FormHelperText>
        //   </FormControl>
        // ),
      },
      {
        headerName: "Status",
        field: "status",
        editable: false,
        width: 200,
        renderCell: ({ value }) => {
          <ProjectStatusBadge
            phaseName={value?.moped_proj_phases?.[0]?.moped_phase?.phase_name}
            phaseKey={value?.moped_proj_phases?.[0]?.moped_phase?.phase_key}
            condensed
          />;
        },
        // customSort: (a, b) =>
        //   a.moped_proj_phases?.[0]?.moped_phase?.phase_name <
        //   b.moped_proj_phases?.[0]?.moped_phase?.phase_name
        //     ? -1
        //     : 1,
        // render: (entry) => (
        // <ProjectStatusBadge
        //   phaseName={entry.moped_proj_phases?.[0]?.moped_phase?.phase_name}
        //   phaseKey={entry.moped_proj_phases?.[0]?.moped_phase?.phase_key}
        //   condensed
        // />
        // ),
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
                onClick={handleSaveClick(id)}
              />,
              // <GridActionsCellItem
              //   icon={<CloseIcon sx={{ fontSize: "24px" }} />}
              //   label="Cancel"
              //   className="textPrimary"
              //   onClick={handleCancelClick(id)}
              //   color="inherit"
              // />,
            ];
          }
          return [
            <GridActionsCellItem
              icon={<EditOutlinedIcon sx={{ fontSize: "24px" }} />}
              label="Edit"
              className="textPrimary"
              // onClick={handleEditClick(id)}
              color="inherit"
            />,
            // <GridActionsCellItem
            //   icon={<DeleteOutlineIcon sx={{ fontSize: "24px" }} />}
            //   label="Delete"
            //   onClick={() => handleDeleteOpen(id)}
            //   color="inherit"
            // />,
          ];
        },
      },
    ];
  }, [
    data,
    rowModesModel,
    // handleDeleteOpen,
    handleSaveClick,
    // handleCancelClick,
    // handleEditClick,
  ]);

const SubprojectsTable = ({ projectId = null, refetchSummaryData }) => {
  const { loading, error, data, refetch } = useQuery(SUBPROJECT_QUERY, {
    variables: { projectId: projectId },
    fetchPolicy: "no-cache",
  });

  const [updateProjectSubproject] = useMutation(UPDATE_PROJECT_SUBPROJECT);
  const [deleteProjectSubproject] = useMutation(DELETE_PROJECT_SUBPROJECT);

  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});

  useEffect(() => {
    if (data && data.subprojects.length > 0) {
      setRows(data.subprojects);
    }
  }, [data]);

  if (error) console.error(error);
  if (loading || !data);

  const handleAddSubprojectClick = () => {
    console.log("subproject clicked");
    // use a random id to keep track of row in row modes model and data grid rows
    // before the record is added to the db
    const id = uuidv4();
    setRows((oldRows) => [
      {
        id,
        project_id: id,
        project_name_full: null,
        status: null,
        isNew: true,
      },
      ...oldRows,
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "project_name_full" },
    }));
  };

  const handleSaveClick = useCallback(
    (id) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    },
    [rowModesModel]
  );

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const processRowUpdate = (updatedRow) => {
    // const updatedSubprojectData = updatedRow;

    // delete updatedSubprojectData.isNew;
    // delete updatedSubprojectData.id;

    // updateProjectSubproject({
    //   variables: {
    //     objects: {
    //       ...updatedSubprojectData,
    //     },
    //   },
    // });

    const childProjectId = updatedRow?.project_name_full?.project_id;
    return updateProjectSubproject({
      variables: {
        parentProjectId: projectId,
        childProjectId: childProjectId,
      },
    })
      .then(() => {
        refetch();
        refetchSummaryData(); // Refresh subprojects in summary map
      })
      .catch((error) => console.error(error));
  };

  const dataGridColumns = useColumns({
    data,
    rowModesModel,
    // handleDeleteOpen,
    handleSaveClick,
    // handleCancelClick,
    // handleEditClick,
  });

  return (
    <ApolloErrorHandler errors={error}>
      <DataGridPro
        sx={dataGridProStyleOverrides}
        columns={dataGridColumns}
        rows={rows}
        getRowId={(row) => row.project_id}
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        slots={{ toolbar: SubprojectsToolbar }}
        slotProps={{ toolbar: { onClick: handleAddSubprojectClick } }}
        editMode="row"
        processRowUpdate={processRowUpdate}
        hideFooter
        // data={data.subprojects ?? []}
        // columns={columns}
        // style={{ padding: "8px" }}
        // components={{
        //   // Note: in our other instances of Material Table, we bypass submitting the form on enter
        //   // In this table, since we currently only have one field to select, enter will submit the form
        //   Action: (props) => {
        //     // If isn't the add action
        //     if (
        //       typeof props.action === typeof Function ||
        //       props.action.tooltip !== "Add"
        //     ) {
        //       // return <MTableAction {...props} />;
        //     } else {
        //       return (
        //         <Button
        //           variant="contained"
        //           color="primary"
        //           startIcon={<AddCircleIcon />}
        //           ref={addActionRef}
        //           onClick={props.action.onClick}
        //         >
        //           Add subproject
        //         </Button>
        //       );
        //     }
        //   },
        //   Toolbar: (props) => (
        //     // to have it align with table content
        //     <div style={{ marginLeft: "-10px" }}>
        //       {/* <MTableToolbar {...props} /> */}
        //     </div>
        //   ),
        // }}
        // title={
        //   <Typography variant="h2" color="primary">
        //     Subprojects
        //   </Typography>
        // }
        // options={{
        //   paging: false,
        //   search: false,
        //   rowStyle: { fontFamily: typography.fontFamily },
        //   actionsColumnIndex: -1,
        //   tableLayout: "fixed",
        //   addRowPosition: "first",
        //   idSynonym: "project_id",
        // }}
        // localization={{
        //   header: {
        //     actions: "",
        //   },
        //   body: {
        //     emptyDataSourceMessage: (
        //       <Typography variant="body1">No subprojects to display</Typography>
        //     ),
        //     editRow: {
        //       deleteText: "Are you sure you want to remove this subproject?",
        //     },
        //   },
        // }}
        // icons={{ Delete: DeleteOutlineIcon, Edit: EditOutlinedIcon }}
        // editable={{
        // onRowAdd: (newData) => {
        //   const childProjectId = newData?.project_name_full?.project_id;
        //   return updateProjectSubproject({
        //     variables: {
        //       parentProjectId: projectId,
        //       childProjectId: childProjectId,
        //     },
        //   })
        //     .then(() => {
        //       refetch();
        //       refetchSummaryData(); // Refresh subprojects in summary map
        //     })
        //     .catch((error) => console.error(error));
        // },
        //   onRowDelete: (newData) => {
        //     const childProjectId = newData?.project_id;
        //     return deleteProjectSubproject({
        //       variables: {
        //         childProjectId: childProjectId,
        //       },
        //     })
        //       .then(() => {
        //         refetch();
        //         refetchSummaryData(); // Refresh subprojects in summary map
        //       })
        //       .catch((error) => console.error(error));
        //   },
        // }}
      />
    </ApolloErrorHandler>
  );
};

export default SubprojectsTable;
