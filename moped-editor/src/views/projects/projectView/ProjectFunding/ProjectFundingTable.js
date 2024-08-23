import React, { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import isEqual from "lodash/isEqual";

// Material
import {
  Alert,
  Autocomplete,
  CircularProgress,
  Snackbar,
  TextField,
  Box,
} from "@mui/material";
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
  gridColumnFieldsSelector,
} from "@mui/x-data-grid-pro";
import { v4 as uuidv4 } from "uuid";
import { currencyFormatter } from "../../../../utils/numberFormatters";

import ApolloErrorHandler from "../../../../components/ApolloErrorHandler";

import {
  FUNDING_QUERY,
  UPDATE_PROJECT_FUNDING,
  ADD_PROJECT_FUNDING,
  DELETE_PROJECT_FUNDING,
} from "../../../../queries/funding";

import { getDatabaseId, useUser } from "../../../../auth/user";
import FundingDeptUnitAutocomplete from "./FundingDeptUnitAutocomplete";
import DollarAmountIntegerField from "./DollarAmountIntegerField";
import DataGridTextField from "../DataGridTextField";
import SubprojectFundingModal from "./SubprojectFundingModal";
import ProjectFundingToolbar from "./ProjectFundingToolbar";
import CustomPopper from "../../../../components/CustomPopper";
import LookupSelectComponent from "../../../../components/LookupSelectComponent";
import LookupAutocompleteComponent from "./LookupAutocompleteComponent";
import FundAutocompleteComponent from "./FundAutocompleteComponent";
import dataGridProStyleOverrides from "src/styles/dataGridProStylesOverrides";
import DeleteConfirmationModal from "../DeleteConfirmationModal";

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

  /** Hook that provides memoized column settings */
const useColumns = ({  }) =>
  useMemo(() => {
    return [


    ];
  }, []);

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
  // rows and rowModesModel used in DataGrid
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);

  const handleSubprojectDialogClose = () => {
    setIsDialogOpen(false);
    refetch();
  };

  const handleDeleteOpen = (id) => {
    setIsDeleteConfirmationOpen(true);
    setDeleteConfirmationId(id);
  };

  const fdusArray = useFdusArray(data?.moped_proj_funding);

  useEffect(() => {
    if (data && data.moped_proj_funding.length > 0) {
      setRows(data.moped_proj_funding);
    }
  }, [data]);

  const handleTabKeyDown = React.useCallback(
    (params, event) => {
      if (params.cellMode === GridRowModes.Edit) {
        if (event.key === "Tab") {
          const columnFields = gridColumnFieldsSelector(apiRef).filter(
            (field) =>
              apiRef.current.isCellEditable(
                apiRef.current.getCellParams(params.id, field)
              )
          );

          // Always prevent going to the next element in the tab sequence because the focus is
          // handled manually to support edit components rendered inside Portals
          event.preventDefault();

          const index = columnFields.findIndex(
            (field) => field === params.field
          );
          const rowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(
            params.id
          );
          const nextFieldToFocus =
            columnFields[event.shiftKey ? index - 1 : index + 1];
          apiRef.current.setCellFocus(params.id, nextFieldToFocus);
          // if the column is not visible, bring it into view
          apiRef.current.scrollToIndexes({ rowIndex, colIndex: index + 1 });
        }
      }
    },
    [apiRef]
  );

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
   * Return Snackbar state to default, closed state
   */
  const handleSnackbarClose = () => {
    setSnackbarState(DEFAULT_SNACKBAR_STATE);
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  // adds a blank row to the table and updates the row modes model
  const handleAddRecordClick = () => {
    // use a random id to keep track of row in row modes model and data grid rows
    // before the record is added to the db
    const id = uuidv4();
    setRows((oldRows) => [
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
      ...oldRows,
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

  // handles row delete
  const handleDeleteClick = (id) => () => {
    // remove row from rows in state
    setRows(rows.filter((row) => row.proj_funding_id !== id));

    const deletedRow = rows.find((row) => row.proj_funding_id === id);
    // if the deleted row is in the db, delete from db
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

  // when a user cancels editing by clicking the X in the actions
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

  // saves row update, either editing an existing row or saving a new row
  const processRowUpdate = (updatedRow, originalRow) => {
    const updateProjectFundingData = updatedRow;
    // Remove unexpected variables
    delete updateProjectFundingData.__typename;

    // preventing empty strings from being saved
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
      delete updateProjectFundingData.proj_funding_id;

      return (
        addProjectFunding({
          variables: {
            objects: {
              ...updateProjectFundingData,
              project_id: projectId,
              // If no new funding status is selected, the default should be used
              funding_status_id:
                updateProjectFundingData.funding_status_id || 1,
            },
          },
        })
          .then((response) => {
            // replace the temporary row id with the one proj funding id from the record creation
            const record_id =
              response.data.insert_moped_proj_funding.returning[0]
                .proj_funding_id;
            updatedRow.proj_funding_id = record_id;
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
      );
    } else {
      // Remove __typename since we removed it from updatedRow and check if the row has changed
      delete originalRow.__typename;
      const hasRowChanged = !isEqual(updatedRow, originalRow);

      if (!hasRowChanged) {
        return Promise.resolve(updatedRow);
      } else {
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
      }
    }
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
  const columns = useColumns({

  });

  if (loading || !data) return <CircularProgress />;

  const dataGridColumns = [
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
          lookupTable={data["moped_fund_sources"]}
          data={data.moped_fund_sources}
        />
      ),
    },
    {
      headerName: "Program",
      field: "funding_program_id",
      width: 200,
      editable: true,
      renderCell: ({ value }) =>
        getLookupValueByID("moped_fund_programs", "funding_program", value),
      renderEditCell: (props) => (
        <LookupAutocompleteComponent
          {...props}
          name={"funding_program"}
          lookupTable={data["moped_fund_programs"]}
          data={data.moped_fund_programs}
        />
      ),
    },
    {
      headerName: "Description",
      field: "funding_description",
      width: 200,
      editable: true,
      renderEditCell: (props) => <DataGridTextField {...props} />,
    },
    {
      headerName: "Status",
      field: "funding_status_id",
      editable: true,
      width: 200,
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
      valueFormatter: (value) =>
        !!value?.fund_name ? `${value?.fund_id} | ${value?.fund_name}` : "",
      renderEditCell: (props) => (
        <FundAutocompleteComponent {...props} data={data.moped_funds} />
      ),
    },
    {
      headerName: "Dept-unit",
      field: "dept_unit",
      width: 225,
      editable: true,
      valueFormatter: (value) =>
        !!value?.unit_long_name
          ? `${value?.dept} | ${value?.unit} |
            ${value?.unit_long_name}`
          : "",
      renderEditCell: (props) => (
        <FundingDeptUnitAutocomplete
          props={props}
          value={props.value}
        />
      ),
    },
    {
      headerName: "Amount",
      field: "funding_amount",
      width: 100,
      editable: true,
      valueFormatter: (value) => currencyFormatter.format(value),
      renderEditCell: (props) => <DollarAmountIntegerField {...props} />,
      type: "currency",
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
            <GridActionsCellItem
              icon={<CloseIcon sx={{ fontSize: "24px" }} />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }
        return [
          <GridActionsCellItem
            icon={<EditOutlinedIcon sx={{ fontSize: "24px" }} />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteOutlineIcon sx={{ fontSize: "24px" }} />}
            label="Delete"
            onClick={() => handleDeleteOpen(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  const eCaprisID = data?.moped_project[0].ecapris_subproject_id;

  return (
    <ApolloErrorHandler errors={error}>
      <Box my={4}>
        <DataGridPro
          sx={dataGridProStyleOverrides}
          apiRef={apiRef}
          ref={apiRef}
          autoHeight
          columns={dataGridColumns}
          rows={rows}
          getRowId={(row) => row.proj_funding_id}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={handleProcessUpdateError}
          disableRowSelectionOnClick
          toolbar
          density="comfortable"
          getRowHeight={() => "auto"}
          hideFooter
          onCellKeyDown={handleTabKeyDown}
          localeText={{ noRowsLabel: "No funding sources" }}
          initialState={{ pinnedColumns: { right: ["edit"] } }}
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
      <DeleteConfirmationModal
        type={"funding source"}
        submitDelete={handleDeleteClick(deleteConfirmationId)}
        isDeleteConfirmationOpen={isDeleteConfirmationOpen}
        setIsDeleteConfirmationOpen={setIsDeleteConfirmationOpen}
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
