import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import isEqual from "lodash/isEqual";

// Material
import { CircularProgress, Box } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import {
  DataGridPro,
  GridRowModes,
  useGridApiRef,
  gridColumnFieldsSelector,
} from "@mui/x-data-grid-pro";
import { v4 as uuidv4 } from "uuid";
import { currencyFormatter } from "src/utils/numberFormatters";

import ApolloErrorHandler from "src/components/ApolloErrorHandler";

import {
  FUNDING_QUERY,
  UPDATE_PROJECT_FUNDING,
  ADD_PROJECT_FUNDING,
  DELETE_PROJECT_FUNDING,
} from "src/queries/funding";
import { useSocrataJson } from "src/utils/socrataHelpers";

import DollarAmountIntegerField from "src/views/projects/projectView/ProjectFunding/DollarAmountIntegerField";
import DataGridTextField from "src/components/DataGridPro/DataGridTextField";
import SubprojectFundingModal from "src/views/projects/projectView/ProjectFunding/SubprojectFundingModal";
import ProjectFundingToolbar from "src/views/projects/projectView/ProjectFunding/ProjectFundingToolbar";
import LookupSelectComponent from "src/components/LookupSelectComponent";
import LookupAutocompleteComponent from "src/components/DataGridPro/LookupAutocompleteComponent";
import dataGridProStyleOverrides from "src/styles/dataGridProStylesOverrides";
import DeleteConfirmationModal from "src/views/projects/projectView/DeleteConfirmationModal";
import { getLookupValueByID } from "src/components/DataGridPro/utils/helpers";
import DataGridActions from "src/components/DataGridPro/DataGridActions";
import { handleRowEditStop } from "src/utils/dataGridHelpers";

const useStyles = makeStyles((theme) => ({
  fieldGridItem: {
    margin: theme.spacing(2),
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
  toolbarTitle: {
    marginBottom: theme.spacing(1),
  },
}));

/*
 * Transportation Project Financial Codes
 */
const SOCRATA_ENDPOINT =
  "https://data.austintexas.gov/resource/bgrt-2m2z.json?$limit=999999";

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

// object to pass to the Fund column's LookupAutocomplete component
const fundAutocompleteProps = {
  getOptionLabel: (option) =>
    option.fund_id ? `${option.fund_id} | ${option.fund_name}` : "",
  isOptionEqualToValue: (value, option) =>
    value.fund_id === option.fund_id && value.fund_name === option.fund_name,
};

// object to pass to the Dept Unit column's LookupAutocomplete component
const deptunitAutocompleteProps = {
  getOptionLabel: (option) =>
    !!option.dept
      ? `${option.dept} | ${option.unit} | ${option.unit_long_name} `
      : "",
  isOptionEqualToValue: (value, option) =>
    value.unit_long_name === option.unit_long_name,
};

/** Hook that provides memoized column settings */
const useColumns = ({
  data,
  rowModesModel,
  handleDeleteOpen,
  handleSaveClick,
  handleCancelClick,
  handleEditClick,
  deptUnitData,
}) =>
  useMemo(() => {
    return [
      {
        headerName: "Source",
        field: "moped_fund_source",
        width: 200,
        editable: true,
        valueFormatter: (value) => value?.funding_source_name,
        sortComparator: (v1, v2) =>
          v1.funding_source_name.localeCompare(v2.funding_source_name),
        renderEditCell: (props) => (
          <LookupAutocompleteComponent
            {...props}
            name={"funding_source"}
            options={data["moped_fund_sources"]}
            fullWidthPopper={true}
          />
        ),
      },
      {
        headerName: "Program",
        field: "moped_fund_program",
        width: 200,
        editable: true,
        valueFormatter: (value) => value?.funding_program_name,
        sortComparator: (v1, v2) =>
          v1.funding_program_name.localeCompare(v2.funding_program_name),
        renderEditCell: (props) => (
          <LookupAutocompleteComponent
            {...props}
            name={"funding_program"}
            options={data["moped_fund_programs"]}
            fullWidthPopper={true}
          />
        ),
      },
      {
        headerName: "Description",
        field: "funding_description",
        width: 200,
        editable: true,
        renderEditCell: (props) => <DataGridTextField {...props} multiline />,
      },
      {
        headerName: "Status",
        field: "funding_status_id",
        editable: true,
        width: 200,
        valueFormatter: (value) =>
          getLookupValueByID(
            data["moped_fund_status"],
            "funding_status",
            value
          ),
        sortComparator: (v1, v2) =>
          getLookupValueByID(
            data["moped_fund_status"],
            "funding_status",
            v1
          ).localeCompare(
            getLookupValueByID(data["moped_fund_status"], "funding_status", v2)
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
        editable: true,
        valueFormatter: (value) =>
          !!value?.fund_name ? `${value?.fund_id} | ${value?.fund_name}` : "",
        sortComparator: (v1, v2) =>
          `${v1?.fund_id} | ${v1?.fund_name}`.localeCompare(
            `${v2?.fund_id} | ${v2?.fund_name}`
          ),
        renderEditCell: (props) => (
          <LookupAutocompleteComponent
            {...props}
            name={"fund"}
            options={data.moped_funds}
            fullWidthPopper={true}
            autocompleteProps={fundAutocompleteProps}
          />
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
        sortComparator: (v1, v2) =>
          `${v1?.dept} | ${v1?.unit} |
              ${v1?.unit_long_name}`.localeCompare(
            `${v2?.dept} | ${v2?.unit} |
              ${v2?.unit_long_name}`
          ),
        renderEditCell: (props) => (
          <LookupAutocompleteComponent
            {...props}
            name={"dept_unit"}
            options={deptUnitData}
            autocompleteProps={deptunitAutocompleteProps}
            fullWidthPopper={true}
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
        renderCell: ({ id }) => (
          <DataGridActions
            id={id}
            rowModesModel={rowModesModel}
            handleCancelClick={handleCancelClick}
            handleDeleteOpen={handleDeleteOpen}
            handleSaveClick={handleSaveClick}
            handleEditClick={handleEditClick}
          />
        ),
      },
    ];
  }, [
    data,
    rowModesModel,
    handleDeleteOpen,
    handleSaveClick,
    handleCancelClick,
    handleEditClick,
    deptUnitData,
  ]);

const ProjectFundingTable = ({ handleSnackbar, refetchProjectSummary }) => {
  const apiRef = useGridApiRef();
  const classes = useStyles();

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
  const { data: deptUnitData, error: socrataError } =
    useSocrataJson(SOCRATA_ENDPOINT);

  const [addProjectFunding] = useMutation(ADD_PROJECT_FUNDING);
  const [updateProjectFunding] = useMutation(UPDATE_PROJECT_FUNDING);
  const [deleteProjectFunding] = useMutation(DELETE_PROJECT_FUNDING);

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

  const handleDeleteOpen = useCallback(
    (id) => () => {
      setIsDeleteConfirmationOpen(true);
      setDeleteConfirmationId(id);
    },
    []
  );

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
        moped_fund_source: null,
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
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "moped_fund_source" },
    }));
  };

  const handleEditClick = useCallback(
    (id) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    },
    [rowModesModel]
  );

  const handleSaveClick = useCallback(
    (id) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    },
    [rowModesModel]
  );

  // handles row delete
  const handleDeleteClick = useCallback(
    (id) => () => {
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
          .then(() => {
            setIsDeleteConfirmationOpen(false);
            handleSnackbar(true, "Funding source deleted", "success");
          })
          .catch((error) => {
            handleSnackbar(
              true,
              "Error deleting funding source",
              "error",
              error
            );
          });
      }
    },
    [rows, deleteProjectFunding, refetch, handleSnackbar]
  );

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
    const updateProjectFundingData = { ...updatedRow };
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

    updateProjectFundingData.funding_source_id =
      updateProjectFundingData.moped_fund_source?.funding_source_id || null;
    delete updateProjectFundingData.moped_fund_source;

    updateProjectFundingData.funding_program_id =
      updateProjectFundingData.moped_fund_program?.funding_program_id || null;
    delete updateProjectFundingData.moped_fund_program;

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
          .then(() => {
            refetch();
            handleSnackbar(true, "Funding source added", "success");
          })
          // from the data grid docs:
          // Please note that the processRowUpdate must return the row object to update the Data Grid internal state.
          .then(() => updatedRow)
          .catch((error) => {
            handleSnackbar(true, "Error adding funding source", "error", error);
          })
      );
    } else {
      // Remove __typename and check if the row has changed
      delete originalRow.__typename;
      delete updatedRow.__typename;
      const hasRowChanged = !isEqual(updatedRow, originalRow);

      if (!hasRowChanged) {
        return Promise.resolve(updatedRow);
      } else {
        return (
          updateProjectFunding({
            variables: updateProjectFundingData,
          })
            .then(() => {
              refetch();
              handleSnackbar(true, "Funding source updated", "success");
            })
            // from the data grid docs:
            // Please note that the processRowUpdate must return the row object to update the Data Grid internal state.
            .then(() => updatedRow)
            .catch((error) => {
              handleSnackbar(
                true,
                "Error updating funding source",
                "error",
                error
              );
            })
        );
      }
    }
  };

  const dataGridColumns = useColumns({
    data,
    rowModesModel,
    handleDeleteOpen,
    handleSaveClick,
    handleCancelClick,
    handleEditClick,
    deptUnitData,
  });

  if (socrataError) console.error(socrataError);
  if (loading || !data) return <CircularProgress />;

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
          onRowEditStop={handleRowEditStop}
          onRowModesModelChange={handleRowModesModelChange}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={(error) => console.error(error)}
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
              refetch: () => {
                refetch();
                refetchProjectSummary();
              },
              handleSnackbar: handleSnackbar,
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
      <SubprojectFundingModal
        isDialogOpen={isDialogOpen}
        handleDialogClose={handleSubprojectDialogClose}
        eCaprisID={eCaprisID}
        fdusArray={fdusArray}
        addProjectFunding={addProjectFunding}
        projectId={projectId}
        handleSnackbar={handleSnackbar}
        refetch={refetch}
      />
    </ApolloErrorHandler>
  );
};

export default ProjectFundingTable;
