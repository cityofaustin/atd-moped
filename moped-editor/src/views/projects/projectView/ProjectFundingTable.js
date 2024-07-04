import React, { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";

// Material
import {
  CircularProgress,
  Snackbar,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { Alert, Autocomplete } from "@mui/material";
import {
  DeleteOutline as DeleteOutlineIcon,
  EditOutlined as EditOutlinedIcon,
} from "@mui/icons-material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import makeStyles from "@mui/styles/makeStyles";
import {
  DataGridPro,
  GridRowModes,
  GridActionsCellItem,
  useGridApiContext,
  useGridApiRef,
} from "@mui/x-data-grid-pro";
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
import FundingDeptUnitAutocomplete from "./FundingDeptUnitAutocomplete";
import DollarAmountIntegerField from "./DollarAmountIntegerField";
import SubprojectFundingModal from "./SubprojectFundingModal";
import ProjectFundingToolbar from "./ProjectFundingToolbar";
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

const ProjectFundingTable = () => {
  const apiRef = useGridApiRef();

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
  const [deleteProjectFunding] = useMutation(DELETE_PROJECT_FUNDING);

  const DEFAULT_SNACKBAR_STATE = {
    open: false,
    message: null,
    severity: "success",
  };
  const [snackbarState, setSnackbarState] = useState(DEFAULT_SNACKBAR_STATE);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rows, setRows] = useState(data?.moped_proj_funding);
  const [rowModesModel, setRowModesModel] = useState({});

  const handleSubprojectDialogClose = () => {
    setIsDialogOpen(false);
    refetch();
  };

  const fdusArray = useFdusArray(data?.moped_proj_funding);

  const handleRowModesModelChange = (newRowModesModel) => {
    console.log("handle", newRowModesModel);
    setRowModesModel(newRowModesModel);
  };

  useEffect(() => {
    if (data && data.moped_proj_funding.length > 0) {
      setRows(data.moped_proj_funding);
    }
  }, [data]);

  if (loading || !data || !rows) return <CircularProgress />;

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

  // /**
  //  * Lookup object formatted from GraphQL query data response into the
  //  * shape that <MaterialTable> expects
  //  * @param {array} arr - array of items from data object {ex: data.moped_fund_sources}
  //  * @param {key} string - item attribute to return as key ex: "funding_source_id"
  //  * @param {value} string - item attribute to return as value ex: "funding_source_name"
  //  * @return {object} - object of key/pair values with lookup item id and name
  //  */
  // const queryArrayToLookupObject = (arr, key, value) => {
  //   return arr.reduce((obj, item) => {
  //     obj[item[key]] = item[value];
  //     return obj;
  //   }, {});
  // };

  const LookupAutocompleteComponent = (props) => {
    const { id, value, field } = props;
    const apiRef = useGridApiContext();
    const ref = React.useRef(null);

    const handleChange = (event, newValue) => {
      apiRef.current.setEditCellValue({
        id,
        field,
        value: newValue ? newValue[`${props.name}_id`] : null,
      });
    };

    return (
      <Autocomplete
        style={{ minWidth: "200px" }}
        ref={ref}
        value={
          // if we are editing, the autocomplete has the value provided by the material table, which is the record id
          // need to get its corresponding text value
          props.value
            ? getLookupValueByID(props.lookupTableName, props.name, value)
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
        onChange={handleChange}
      />
    );
  };

  const FundAutocompleteComponent = (props) => {
    const { id, value, field } = props;
    const apiRef = useGridApiContext();
    const ref = React.useRef(null);

    const handleChange = (event, newValue) => {
      apiRef.current.setEditCellValue({
        id,
        field,
        value: newValue ?? null,
      });
    };

    return (
      <Autocomplete
        className={classes.fundSelectStyle}
        ref={ref}
        value={value ?? null}
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
          value.fund_id === option.fund_id &&
          value.fund_name === option.fund_name
        }
        onChange={handleChange}
      />
    );
  };

  /**
   * Return Snackbar state to default, closed state
   */
  const handleSnackbarClose = () => {
    setSnackbarState(DEFAULT_SNACKBAR_STATE);
  };

  const handleAddRecordClick = () => {
    const id = Math.floor(Math.random() * 10000);
    setRows((oldRows) => [
      ...oldRows,
      {
        id,
        funding_source_id: null,
        funding_program_id: null,
        funding_description: null,
        funding_status_id: null,
        fund: null,
        dept_unit: null,
        funding_amount: null,
        isNew: true,
        proj_funding_id: id,
      },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "source" },
    }));
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.proj_funding_id !== id));

    const deletedRow = rows.find((row) => row.proj_funding_id === id);
    if (!deletedRow.isNew) {
      deleteProjectFunding({
        variables: {
          proj_funding_id: id,
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
        });
    }
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
    const editedRow = rows.find((row) => row.proj_funding_id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (updatedRow, originalRow) => {
    console.log("process row update");
    console.log(updatedRow, originalRow);

    const updateProjectFundingData = updatedRow;
    // Remove unexpected variables
    delete updateProjectFundingData.__typename;

    updateProjectFundingData.funding_amount =
      updateProjectFundingData.funding_amount || null;
    updateProjectFundingData.funding_description =
      !updateProjectFundingData.funding_description ||
      updateProjectFundingData.funding_description.trim() === ""
        ? null
        : updateProjectFundingData.funding_description;

    if (updatedRow.isNew) {
      delete updateProjectFundingData.isNew;
      delete updateProjectFundingData.id;
      updateProjectFundingData.proj_funding_id = null;

      return (
      addProjectFunding({
        variables: {
          objects: {
            ...updateProjectFundingData,
            project_id: projectId,
            // preventing empty strings from being saved
            // funding_description:
            //   !newData.funding_description ||
            //   newData.funding_description.trim() === ""
            //     ? null
            //     : newData.funding_description,
            // funding_amount:
            //   !newData.funding_amount ||
            //   newData.funding_amount.trim() === ""
            //     ? null
            //     : newData.funding_amount,
            // If no new funding status is selected, the default should be used
            funding_status_id: updateProjectFundingData.funding_status_id || 1,
          },
        },
      })
        .then(() => refetch())
        // from the data grid docs:
        // Please note that the processRowUpdate must return the row object to update the Data Grid internal state.
        .then(() => updatedRow)
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
        })
      )
    }
    return (
      updateProjectFunding({
        variables: updateProjectFundingData,
      })
        .then(() => refetch())
        // from the data grid docs:
        // Please note that the processRowUpdate must return the row object to update the Data Grid internal state.
        .then(() => updatedRow)
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
        })
    );
  };

  const handleRowEditStop = (params, event) => {
    console.log("row edit stop");
    console.log(params, event);
  };

  const handleProcessUpdateError = (error) => {
    setSnackbarState({
      open: true,
      message: (
        <span>
          There was a problem updating funding. Error message: {error.message}
        </span>
      ),
      severity: "error",
    });
  };

  const dataGridColumns = [
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
              icon={<CheckIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CloseIcon />}
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
      editable: true,
      renderCell: ({ value }) =>
        getLookupValueByID("moped_fund_sources", "funding_source", value),
      renderEditCell: (props) => (
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
      editable: true,
      renderCell: ({ value }) =>
        getLookupValueByID("moped_fund_programs", "funding_program", value),
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
    },
    {
      headerName: "Status",
      field: "funding_status_id",
      renderCell: ({ value }) =>
        getLookupValueByID("moped_fund_status", "funding_status", value),
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
      editable: true,
      renderCell: ({ row }) =>
        !!row.fund?.fund_name ? (
          <>
            <Typography>{row.fund?.fund_id} |</Typography>
            <Typography>{row.fund?.fund_name}</Typography>
          </>
        ) : (
          ""
        ),
      renderEditCell: (props) => (
        <FundAutocompleteComponent {...props} data={data.moped_funds} />
      ),
    },
    {
      headerName: "Dept-unit",
      field: "dept_unit",
      width: 200,
      renderCell: ({ row }) =>
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
      renderCell: ({ value }) => currencyFormatter.format(value),
      editComponent: (props) => <DollarAmountIntegerField {...props} />,
      type: "currency",
    },
  ];

  const eCaprisID = data?.moped_project[0].ecapris_subproject_id;

  return (
    <ApolloErrorHandler errors={error}>
      <Box my={4}>
        <DataGridPro
          sx={dataGridProStyleOverrides}
          apiRef={apiRef}
          autoHeight
          columns={dataGridColumns}
          rows={rows}
          // rows={data.moped_proj_funding}
          getRowId={(row) => row.proj_funding_id}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={handleProcessUpdateError}
          toolbar
          density="comfortable"
          // disableRowSelectionOnClick
          getRowHeight={() => "auto"}
          hideFooter
          localeText={{ noRowsLabel: "No funding sources" }}
          slots={{
            toolbar: ProjectFundingToolbar,
          }}
          slotProps={{
            toolbar: {
              onClick: handleAddRecordClick,
              projectId: projectId,
              eCaprisID: eCaprisID,
              data: data,
              refetch: refetch,
              snackbarHandle: snackbarHandle,
              classes: classes,
              noWrapper: true,
              setIsDialogOpen: setIsDialogOpen,
            },
          }}
        />
      </Box>
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
