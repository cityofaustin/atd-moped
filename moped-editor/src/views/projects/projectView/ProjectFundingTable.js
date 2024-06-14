import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";

// Material
import {
  Button,
  CircularProgress,
  IconButton,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { Alert, Autocomplete } from "@mui/material";
import {
  AddCircle as AddCircleIcon,
  DeleteOutline as DeleteOutlineIcon,
  EditOutlined as EditOutlinedIcon,
} from "@mui/icons-material";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import makeStyles from "@mui/styles/makeStyles";
import MaterialTable, {
  MTableEditRow,
  MTableAction,
  MTableToolbar,
} from "@material-table/core";
import { DataGridPro, GridRowModes,   GridActionsCellItem, } from "@mui/x-data-grid-pro";
import typography from "../../../theme/typography";

import { PAGING_DEFAULT_COUNT } from "../../../constants/tables";
import { currencyFormatter } from "../../../utils/numberFormatters";

// Error Handler
import ApolloErrorHandler from "../../../components/ApolloErrorHandler";

import {
  FUNDING_QUERY,
  UPDATE_PROJECT_FUNDING,
  ADD_PROJECT_FUNDING,
  DELETE_PROJECT_FUNDING,
} from "../../../queries/funding";

import { getDatabaseId, useUser } from "../../../auth/user";
import ProjectSummaryProjectECapris from "./ProjectSummary/ProjectSummaryProjectECapris";
import FundingDeptUnitAutocomplete from "./FundingDeptUnitAutocomplete";
import DollarAmountIntegerField from "./DollarAmountIntegerField";
import SubprojectFundingModal from "./SubprojectFundingModal";
import ButtonDropdownMenu from "../../../components/ButtonDropdownMenu";
import CustomPopper from "../../../components/CustomPopper";
import LookupSelectComponent from "../../../components/LookupSelectComponent";
import dataGridProStyleOverrides from "src/styles/dataGridProStylesOverrides"; 

const useStyles = makeStyles((theme) => ({
  fieldGridItem: {
    margin: theme.spacing(2),
  },
  linkIcon: {
    fontSize: "1rem",
  },
  editIconFunding: {
    cursor: "pointer",
    margin: "0.5rem",
    fontSize: "1.5rem",
  },
  editIconContainer: {
    minWidth: "8rem",
    marginLeft: "8px",
  },
  editIconButton: {
    margin: "8px 0",
    padding: "8px",
  },
  editIconConfirm: {
    cursor: "pointer",
    margin: ".25rem 0",
    fontSize: "24px",
  },
  fieldLabel: {
    width: "100%",
    color: theme.palette.text.secondary,
    fontSize: ".8rem",
    margin: "8px 0",
  },
  fieldBox: {
    maxWidth: "10rem",
  },
  fundingButton: {
    position: "absolute",
    top: "1rem",
    right: "1rem",
  },
  chipContainer: {
    display: "flex",
    justifyContent: "left",
    flexWrap: "wrap",
    listStyle: "none",
    padding: "2rem 0",
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  chipAddContainer: {
    minWidth: "500px",
  },
  chipAddMultiselect: {
    width: "100%",
  },
  deptAutocomplete: {
    width: "300px",
    fontSize: ".875em",
    "& .MuiAutocomplete-inputRoot": {
      marginBottom: "16px",
    },
    "& .MuiFormLabel-root": {
      color: theme.palette.text.primary,
    },
  },
  fundSelectStyle: {
    width: "10em",
  },
  fieldLabelText: {
    width: "calc(100% - 2rem)",
    paddingLeft: theme.spacing(0.5),
    "&:hover": {
      backgroundColor: theme.palette.background.summaryHover,
      borderRadius: theme.spacing(0.5),
      cursor: "pointer",
    },
  },
}));

// memoized hook to concatanate fund dept and unit ids into an fdu string
const useFdusArray = (projectFunding) =>
  useMemo(() => {
    if (!projectFunding) {
      return [];
    }
    return projectFunding.map(
      (record) =>
        `${record.fund?.fund_id} ${record.dept_unit?.dept} ${record.dept_unit?.unit}`
    );
  }, [projectFunding]);

  

//  /** Hook that provides memoized column settings */
//  // const useColumns = ({ deleteInProgress, onDeleteActivity, setEditActivity }) =>
//   const useColumns = ({ getLookupValueByID }) =>
//    useMemo(() => {
//      return [
//       {
//     ];
//   }, []);
//   //}, [deleteInProgress, onDeleteActivity, setEditActivity]);

const ProjectFundingTable = () => {
  /** addAction Ref - mutable ref object used to access add action button
   * imperatively.
   * @type {object} addActionRef
   * */
  const addActionRef = React.useRef();

  const classes = useStyles();

  /**
   * User Hook
   * @type {object} CognitoUserSession
   */
  const { user } = useUser();

  /** Params Hook
   * @type {integer} projectId
   * */
  const { projectId } = useParams();

  const { loading, error, data, refetch } = useQuery(FUNDING_QUERY, {
    // sending a null projectId will cause a graphql error
    // id 0 used when creating a new project, no project funding will be returned
    // chia do we still need this
    variables: {
      projectId: projectId ?? 0,
    },
    fetchPolicy: "no-cache",
  });

  const [addProjectFunding] = useMutation(ADD_PROJECT_FUNDING);
  const [updateProjectFunding] = useMutation(UPDATE_PROJECT_FUNDING);
  const [deleteProjectFunding, {loading: deleteInProgress}] = useMutation(DELETE_PROJECT_FUNDING);

  const DEFAULT_SNACKBAR_STATE = {
    open: false,
    message: null,
    severity: "success",
  };
  const [snackbarState, setSnackbarState] = useState(DEFAULT_SNACKBAR_STATE);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rowModesModel, setRowModesModel] = useState({});

  const handleSubprojectDialogClose = () => {
    setIsDialogOpen(false);
    refetch();
  };

  const fdusArray = useFdusArray(data?.moped_proj_funding);

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  if (loading || !data) return <CircularProgress />;

  /**
   * Get lookup value for a given table using a record ID and returning a name
   * @param {string} lookupTable - Name of lookup table as found within the GQL data query object
   * @param {string} attribute - Prefix version of attribute name relying on the pattern of _id and _name
   * @param {number} id - ID used to find target record in lookup table
   * @return {string} - Name of attribute in the given row.
   */
  const getLookupValueByID = (lookupTable, attribute, id) => {
    if (!id) return null;

    return data[lookupTable].find((item) => item[`${attribute}_id`] === id)[
      `${attribute}_name`
    ];
  };


  const userId = getDatabaseId(user);

  /**
   * Wrapper around snackbar state setter
   * @param {boolean} open - The new state of open
   * @param {String} message - The message for the snackbar
   * @param {String} severity - The severity color of the snackbar
   */
  const snackbarHandle = (open = true, message, severity = "success") => {
    setSnackbarState({
      open: open,
      message: message,
      severity: severity,
    });
  };

  /**
   * Lookup object formatted from GraphQL query data response into the
   * shape that <MaterialTable> expects
   * @param {array} arr - array of items from data object {ex: data.moped_fund_sources}
   * @param {key} string - item attribute to return as key ex: "funding_source_id"
   * @param {value} string - item attribute to return as value ex: "funding_source_name"
   * @return {object} - object of key/pair values with lookup item id and name
   */
  const queryArrayToLookupObject = (arr, key, value) => {
    return arr.reduce((obj, item) => {
      obj[item[key]] = item[value];
      return obj;
    }, {});
  };

  /**
   * Component for autocomplete using a lookup table as options
   * @param {*} props
   * @returns {React component}
   */
  const LookupAutocompleteComponent = (props) => (
    <Autocomplete
      style={{ minWidth: "200px" }}
      value={
        // if we are editing, the autocomplete has the value provided by the material table, which is the record id
        // need to get its corresponding text value
        props.value
          ? getLookupValueByID(props.lookupTableName, props.name, props.value)
          : null
      }
      // use customized popper component so menu expands to fullwidth
      PopperComponent={CustomPopper}
      id={props.name}
      options={props.data}
      renderInput={(params) => <TextField variant="standard" {...params} />}
      getOptionLabel={(option) =>
        // if our value is a string, just return the string instead of accessing the name
        typeof option === "string" ? option : option[`${props.name}_name`]
      }
      isOptionEqualToValue={(value, option) =>
        value[`${props.name}_name`] === option
      }
      onChange={(e, value) => {
        value
          ? props.onChange(value[`${props.name}_id`])
          : props.onChange(null);
      }}
    />
  );

  /**
   * Autocomplete component for Funds
   * @param {*} props
   * @returns {React component}
   */
  const FundAutocompleteComponent = (props) => (
    <Autocomplete
      className={classes.fundSelectStyle}
      value={props.value ? props.value : null}
      // use customized popper component so menu expands to fullwidth
      PopperComponent={CustomPopper}
      id={"moped_funds"}
      options={props.data}
      renderInput={(params) => <TextField variant="standard" {...params} />}
      getOptionLabel={(option) =>
        // if our value is a string, just return the string
        typeof option === "string"
          ? option
          : `${option.fund_id} | ${option.fund_name}`
      }
      isOptionEqualToValue={(value, option) =>
        value.fund_id === option.fund_id && value.fund_name === option.fund_name
      }
      onChange={(e, value) => {
        value ? props.onChange(value) : props.onChange(null);
      }}
    />
  );

  /**
   * Return Snackbar state to default, closed state
   */
  const handleSnackbarClose = () => {
    setSnackbarState(DEFAULT_SNACKBAR_STATE);
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };


  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    console.log("delete ", id)
    // setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    // const editedRow = rows.find((row) => row.id === id);
    // if (editedRow.isNew) {
    //   setRows(rows.filter((row) => row.id !== id));
    // }
  };

  const processRowUpdate = (newRow) => {
    console.log(newRow)
    const updatedRow = { ...newRow, isNew: false };
    // setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  /**
   * Column configuration for <MaterialTable>
   */
  const columns = [
    {
      title: "Source",
      field: "funding_source_id",
      render: (row) =>
        getLookupValueByID(
          "moped_fund_sources",
          "funding_source",
          row.funding_source_id
        ),
      lookup: queryArrayToLookupObject(
        data.moped_fund_sources,
        "funding_source_id",
        "funding_source_name"
      ),
      editComponent: (props) => (
        <LookupAutocompleteComponent
          {...props}
          name={"funding_source"}
          lookupTableName={"moped_fund_sources"}
          data={data.moped_fund_sources}
        />
      ),
    },
    {
      title: "Program",
      field: "funding_program_id",
      render: (row) =>
        getLookupValueByID(
          "moped_fund_programs",
          "funding_program",
          row.funding_program_id
        ),
      editComponent: (props) => (
        <LookupAutocompleteComponent
          {...props}
          name={"funding_program"}
          lookupTableName={"moped_fund_programs"}
          data={data.moped_fund_programs}
        />
      ),
    },
    {
      title: "Description",
      field: "funding_description",
      editComponent: (props) => (
        <TextField
          variant="standard"
          id="funding_description"
          name="funding_description"
          multiline
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
        />
      ),
    },
    {
      title: "Status",
      field: "funding_status_id",
      render: (row) =>
        getLookupValueByID(
          "moped_fund_status",
          "funding_status",
          row.funding_status_id
        ),
      editComponent: (props) => (
        <LookupSelectComponent
          {...props}
          name={"funding_status"}
          defaultValue={1}
          data={data.moped_fund_status}
        />
      ),
    },
    {
      title: "Fund",
      field: "fund",
      render: (entry) =>
        !!entry.fund?.fund_name ? (
          <>
            <Typography>{entry.fund?.fund_id} |</Typography>
            <Typography>{entry.fund?.fund_name}</Typography>
          </>
        ) : (
          ""
        ),
      editComponent: (props) => (
        <FundAutocompleteComponent {...props} data={data.moped_funds} />
      ),
    },
    {
      title: "Dept-unit",
      field: "dept_unit",
      render: (entry) =>
        !!entry.dept_unit?.unit_long_name ? (
          <>
            <Typography>
              {entry.dept_unit?.dept} | {entry.dept_unit?.unit} |
            </Typography>
            <Typography>{entry.dept_unit?.unit_long_name}</Typography>
          </>
        ) : (
          ""
        ),
      editComponent: (props) => (
        <FundingDeptUnitAutocomplete
          classes={classes.deptAutocomplete}
          props={props}
          value={props.value}
        />
      ),
    },
    {
      title: "Amount",
      field: "funding_amount",
      render: (row) => currencyFormatter.format(row.funding_amount),
      editComponent: (props) => <DollarAmountIntegerField {...props} />,
      type: "currency",
    },
  ];

  const dataGridColumns = [
    {
      headerName: "",
      field: "edit",
      hideable: false,
      filterable: false,
      sortable: false,
      editable: false,
      type: 'actions',
      getActions: ({ id }) => {
        console.log(id)
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (deleteInProgress) {
          return <CircularProgress color="primary" size={20} />
        }
        else if (isInEditMode) {
          console.log("what")
            return [
              <GridActionsCellItem
                icon={<CheckIcon />}
                label="Save"
                sx={{
                  color: 'primary.main',
                }}
                onClick={handleSaveClick(id)}
              />,
              <GridActionsCellItem
                icon={<CloseIcon />} // x icon
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick(id)}
                color="inherit"
              />,
            ];
          }
        return [
            <GridActionsCellItem
              icon={<EditOutlinedIcon />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick(id)}
              color="inherit"
            />,
            <GridActionsCellItem
              icon={<DeleteOutlineIcon />}
              label="Delete"
              onClick={handleDeleteClick(id)}
              color="inherit"
            />,
          ];
      },
    },
    {
      headerName: "Source",
      field: "funding_source_id",
      width: 200,
      renderCell: ({value}) =>
        getLookupValueByID(
          "moped_fund_sources",
          "funding_source",
          value
        ),
      renderEditCell: (props) => ( // update this component!!! 
        <LookupAutocompleteComponent
          {...props}
          name={"funding_source"}
          lookupTableName={"moped_fund_sources"}
          data={data.moped_fund_sources}
        />
      ),
    },
    {
      headerName: "Program",
      field: "funding_program_id",
      renderCell: ({value}) =>
        getLookupValueByID(
          "moped_fund_programs",
          "funding_program",
          value
        ),
      renderEditCell: (props) => (
        <LookupAutocompleteComponent
          {...props}
          name={"funding_program"}
          lookupTableName={"moped_fund_programs"}
          data={data.moped_fund_programs}
        />
      ),
    },
    {
      headerName: "Description",
      field: "funding_description",
      width: 200,
      editable: true,
      // renderEditCell: (props) => {
      //   console.log(props)
      //   return (
      //   <TextField
      //     variant="standard"
      //     id="funding_description"
      //     name="funding_description"
      //     multiline
      //     value={props.value}
      //     onChange={(e) => props.onChange(e.target.value)}
      //   />
      // )},
    },
    {
      headerName: "Status",
      field: "funding_status_id",
      renderCell: ({value}) =>
        getLookupValueByID(
          "moped_fund_status",
          "funding_status",
          value
        ),
      renderEditCell: (props) => (
        <LookupSelectComponent
          {...props}
          name={"funding_status"}
          defaultValue={1}
          data={data.moped_fund_status}
        />
      ),
    },
    {
      headerName: "Fund",
      field: "fund",
      width: 200,
      renderCell: ({row}) =>
        !!row.fund?.fund_name ? (
          <>
            <Typography>{row.fund?.fund_id} |</Typography>
            <Typography>{row.fund?.fund_name}</Typography>
          </>
        ) : (
          ""
        ),
      editComponent: (props) => (
        <FundAutocompleteComponent {...props} data={data.moped_funds} />
      ),
    },
    {
      headerName: "Dept-unit",
      field: "dept_unit",
      width: 200,
      renderCell: ({row}) => 
        !!row.dept_unit?.unit_long_name ? (
          <>
            <Typography>
              {row.dept_unit?.dept} | {row.dept_unit?.unit} |
            </Typography>
            <Typography>{row.dept_unit?.unit_long_name}</Typography>
          </>
        ) : (
          ""
        ),
      editComponent: (props) => (
        <FundingDeptUnitAutocomplete
          classes={classes.deptAutocomplete}
          props={props}
          value={props.value}
        />
      ),
    },
    {
      headerName: "Amount",
      field: "funding_amount",
      renderCell: ({value}) => currencyFormatter.format(value),
      editComponent: (props) => <DollarAmountIntegerField {...props} />,
      type: "currency",
    },
  ];

  const eCaprisID = data?.moped_project[0].ecapris_subproject_id;

  return (
    <ApolloErrorHandler errors={error}>
      <MaterialTable
        columns={columns}
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
            // Add action icons when for NOT "add"
            if (
              typeof props.action === typeof Function ||
              props.action.tooltip !== "Add"
            ) {
              return <MTableAction {...props} />;
            } else {
              // else add "Add ..." button
              return !!eCaprisID ? (
                <ButtonDropdownMenu
                  buttonWrapperStyle={classes.fundingButton}
                  addAction={props.action.onClick}
                  openActionDialog={setIsDialogOpen}
                  parentButtonText="Add Funding Source"
                  firstOptionText="New funding source"
                  secondOptionText="From eCapris"
                />
              ) : (
                <Button
                  className={classes.fundingButton}
                  variant="contained"
                  color="primary"
                  startIcon={<AddCircleIcon />}
                  ref={addActionRef}
                  onClick={props.action.onClick}
                >
                  Add Funding Source
                </Button>
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
        data={data.moped_proj_funding}
        title={
          <div>
            <Typography
              variant="h2"
              color="primary"
              style={{ paddingTop: "1em" }}
            >
              Funding sources
            </Typography>
            <ProjectSummaryProjectECapris
              projectId={projectId}
              data={data}
              refetch={refetch}
              snackbarHandle={snackbarHandle}
              classes={classes}
              noWrapper
            />
          </div>
        }
        options={{
          ...(data.moped_proj_funding.length < PAGING_DEFAULT_COUNT + 1 && {
            paging: false,
          }),
          search: false,
          rowStyle: {
            fontFamily: typography.fontFamily,
          },
          actionsColumnIndex: -1,
          addRowPosition: "first",
          idSynonym: "proj_funding_id",
        }}
        localization={{
          header: {
            actions: "",
          },
          body: {
            emptyDataSourceMessage: (
              <Typography variant="body1">
                No funding sources to display
              </Typography>
            ),
          },
        }}
        icons={{
          Delete: DeleteOutlineIcon,
          Edit: EditOutlinedIcon,
        }}
        editable={{
          onRowAdd: (newData) =>
            addProjectFunding({
              variables: {
                objects: {
                  ...newData,
                  project_id: projectId,
                  // preventing empty strings from being saved
                  funding_description:
                    !newData.funding_description ||
                    newData.funding_description.trim() === ""
                      ? null
                      : newData.funding_description,
                  funding_amount:
                    !newData.funding_amount ||
                    newData.funding_amount.trim() === ""
                      ? null
                      : newData.funding_amount,
                  // If no new funding status is selected, the default should be used
                  funding_status_id: newData.funding_status_id || 1,
                },
              },
            })
              .then(() => refetch())
              .catch((error) => {
                setSnackbarState({
                  open: true,
                  message: (
                    <span>
                      There was a problem adding funding. Error message:{" "}
                      {error.message}
                    </span>
                  ),
                  severity: "error",
                });
              }),
          onRowUpdate: (newData, oldData) => {
            const updateProjectFundingData = newData;

            // Remove unexpected variables
            delete updateProjectFundingData.__typename;

            updateProjectFundingData.funding_amount =
              updateProjectFundingData.funding_amount || null;
            updateProjectFundingData.funding_description =
              !updateProjectFundingData.funding_description ||
              updateProjectFundingData.funding_description.trim() === ""
                ? null
                : updateProjectFundingData.funding_description;

            return updateProjectFunding({
              variables: updateProjectFundingData,
            })
              .then(() => refetch())
              .catch((error) => {
                setSnackbarState({
                  open: true,
                  message: (
                    <span>
                      There was a problem updating funding. Error message:{" "}
                      {error.message}
                    </span>
                  ),
                  severity: "error",
                });
              });
          },
          onRowDelete: (oldData) =>
            deleteProjectFunding({
              variables: {
                proj_funding_id: oldData.proj_funding_id,
              },
            })
              .then(() => refetch())
              .catch((error) => {
                setSnackbarState({
                  open: true,
                  message: (
                    <span>
                      There was a problem deleting funding. Error message:{" "}
                      {error.message}
                    </span>
                  ),
                  severity: "error",
                });
              }),
        }}
      />
        <DataGridPro
          sx={dataGridProStyleOverrides}
          autoHeight
          columns={dataGridColumns}
          rows={data.moped_proj_funding}
          getRowId={(row) => row.proj_funding_id}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          processRowUpdate={processRowUpdate}
          // toolbar
          density="comfortable"
          // disableRowSelectionOnClick
          getRowHeight={() => "auto"}
          hideFooter
          // localeText={{ noRowsLabel: "No work activites" }}
          // slots={{
          //   toolbar: WorkActivityToolbar,
          // }}
          // slotProps={{
          //   toolbar: { onClick: onClickAddActivity },
          // }}
        />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarState.open}
        onClose={handleSnackbarClose}
        key={"datatable-snackbar"}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarState.severity}>
          {snackbarState.message}
        </Alert>
      </Snackbar>
      <SubprojectFundingModal
        isDialogOpen={isDialogOpen}
        handleDialogClose={handleSubprojectDialogClose}
        eCaprisID={eCaprisID}
        fdusArray={fdusArray}
        addProjectFunding={addProjectFunding}
        userId={userId}
        projectId={projectId}
        setSnackbarState={setSnackbarState}
      />
    </ApolloErrorHandler>
  );
};

export default ProjectFundingTable;
