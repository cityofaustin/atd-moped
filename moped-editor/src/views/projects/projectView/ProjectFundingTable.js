import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";

// Material
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Icon,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import {
  AddCircle as AddCircleIcon,
  DeleteOutline as DeleteOutlineIcon,
} from "@material-ui/icons";
import MaterialTable, { MTableEditRow, MTableAction } from "material-table";
import typography from "../../../theme/typography";

import { PAGING_DEFAULT_COUNT } from "../../../constants/tables";
import { currencyFormatter } from "../../../utils/numberFormatter";
import { handleKeyEvent } from "../../../utils/materialTableHelpers";

// Error Handler
import ApolloErrorHandler from "../../../components/ApolloErrorHandler";

import {
  FUNDING_QUERY,
  UPDATE_PROJECT_FUNDING,
  ADD_PROJECT_FUNDING,
  DELETE_PROJECT_FUNDING,
  UPDATE_FUNDING_TASK_ORDERS,
} from "../../../queries/funding";

import { getDatabaseId, useUser } from "../../../auth/user";
import ProjectSummaryProjectECapris from "./ProjectSummary/ProjectSummaryProjectECapris";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ControlPointIcon from "@material-ui/icons/ControlPoint";
import TaskOrderAutocomplete from "../signalProjectTable/TaskOrderAutocomplete";

const useStyles = makeStyles(theme => ({
  fieldGridItem: {
    margin: theme.spacing(2),
  },
  linkIcon: {
    fontSize: "1rem",
  },
  syncLinkIcon: {
    fontSize: "1.2rem",
  },
  editIcon: {
    cursor: "pointer",
    margin: "0 .5rem",
    fontSize: "20px",
  },
  editIconFunding: {
    cursor: "pointer",
    margin: "0.5rem",
    fontSize: "1.5rem",
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
  fieldLabelText: {
    width: "calc(100% - 2rem)",
  },
  fieldLabelTextSpan: {
    borderBottom: "1px dashed",
    borderBottomColor: theme.palette.text.secondary,
  },
  fieldLabelLink: {
    width: "calc(100% - 2rem)",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
  fieldBox: {
    width: "100%",
  },
  fieldBoxTypography: {
    width: "100%",
  },
  fieldSelectItem: {
    width: "calc(100% - 3rem)",
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
}));

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
    // id 0 used when creating a new project, no project personnel will be returned
    variables: {
      projectId: projectId ?? 0,
    },
    fetchPolicy: "no-cache",
  });

  const [addProjectFunding] = useMutation(ADD_PROJECT_FUNDING);
  const [updateProjectFunding] = useMutation(UPDATE_PROJECT_FUNDING);
  const [deleteProjectFunding] = useMutation(DELETE_PROJECT_FUNDING);

  const [updateProjectTaskOrders] = useMutation(UPDATE_FUNDING_TASK_ORDERS);

  const DEFAULT_SNACKBAR_STATE = {
    open: false,
    message: null,
    severity: "success",
  };
  const [snackbarState, setSnackbarState] = useState(DEFAULT_SNACKBAR_STATE);
  const [addTaskOrderMode, setAddTaskOrderMode] = useState(false);
  const [newTaskOrderList, setNewTaskOrderList] = useState([]);

  if (loading || !data) return <CircularProgress />;

  /**
   * Get lookup value for a given table using a row ID and returning a name
   * @param {string} lookupTable - Name of lookup table as found within the GQL data query object
   * @param {string} attribute - Prefix version of attribute name relying on the pattern of _id and _name
   * @param {number} id - ID used to find target row in lookup table
   * @return {string} - Name of attribute in the given row.
   */
  const getLookupValueByID = (lookupTable, attribute, id) => {
    if (!id) return null;

    return data[lookupTable].find(item => item[`${attribute}_id`] === id)[
      `${attribute}_name`
    ];
  };

  /**
   * An array of objects that contain the task order data
   * @type {Array[Object]}
   */
  const taskOrderData = data?.moped_project?.[0]?.task_order ?? [];

  /**
   * Deletes a task order from the list
   * @param {Object} task -The task to be deleted
   */
  const handleTaskOrderDelete = task =>
    updateProjectTaskOrders({
      variables: {
        projectId: projectId,
        taskOrders: taskOrderData.filter(t => t.id !== task.id),
      },
    })
      .then(() => refetch())
      .catch(() => {});

  /**
   * Handle Task Order OnChange event
   * @param {Object} value - Data from the task order list
   */
  const handleTaskOrderOnChange = value => {
    setNewTaskOrderList(value);
  };

  /**
   * Updates the task order list
   */
  const handleNewTaskOrderSave = () =>
    updateProjectTaskOrders({
      variables: {
        projectId: projectId,
        taskOrders: [
          ...taskOrderData,
          ...newTaskOrderList.filter(
            n => !taskOrderData.find(t => t.id === n.id)
          ),
        ],
      },
    })
      .then(() => refetch())
      .then(() => handleNewTaskOrderCancel());

  /**
   * Cancel action for adding new task orders
   */
  const handleNewTaskOrderCancel = () => {
    setNewTaskOrderList([]);
    setAddTaskOrderMode(false);
  };

  /**
   *
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
   * Component for dropdown select using a lookup table as options
   * @param {*} props
   * @returns {React component}
   */
  const LookupSelectComponent = props => (
    <Select id={props.name} value={props.value || ""}>
      {props.data.map(item => (
        <MenuItem
          onChange={() => props.onChange(item[`${props.name}_id`])}
          onClick={() => props.onChange(item[`${props.name}_id`])}
          onKeyDown={e => handleKeyEvent(e)}
          value={item[`${props.name}_id`]}
          key={item[`${props.name}_name`]}
        >
          {item[`${props.name}_name`]}
        </MenuItem>
      ))}
      {props.columnDef.title === "Program" && (
        <MenuItem
          onChange={() => props.onChange("")}
          onClick={() => props.onChange("")}
          onKeyDown={e => handleKeyEvent(e)}
          value=""
        >
          -
        </MenuItem>
      )}
    </Select>
  );

  /**
   * Handles the click for adding new task orders
   */
  const handleAddTaskOrder = () => {
    setAddTaskOrderMode(true);
  };

  /**
   * Return Snackbar state to default, closed state
   */
  const handleSnackbarClose = () => {
    setSnackbarState(DEFAULT_SNACKBAR_STATE);
  };

  /**
   * Column configuration for <MaterialTable>
   */
  const columns = [
    {
      title: "Source",
      field: "funding_source_id",
      render: row =>
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
      editComponent: props => (
        <LookupSelectComponent
          {...props}
          name={"funding_source"}
          data={data.moped_fund_sources}
        />
      ),
      validate: rowData => (rowData.funding_source_id > 0 ? "" : "Required"),
    },
    {
      title: "Program",
      field: "funding_program_id",
      render: row =>
        getLookupValueByID(
          "moped_fund_programs",
          "funding_program",
          row.funding_program_id
        ),
      editComponent: props => (
        <LookupSelectComponent
          {...props}
          name={"funding_program"}
          data={data.moped_fund_programs}
        />
      ),
    },
    {
      title: "Description",
      field: "funding_description",
      editComponent: props => (
        <TextField
          id="funding_description"
          name="funding_description"
          multiline
          value={props.value}
          onChange={e => props.onChange(e.target.value)}
        />
      ),
    },
    {
      title: "Status",
      field: "funding_status_id",
      render: row =>
        getLookupValueByID(
          "moped_fund_status",
          "funding_status",
          row.funding_status_id
        ),
      editComponent: props => (
        <LookupSelectComponent
          {...props}
          name={"funding_status"}
          data={data.moped_fund_status}
        />
      ),
    },
    {
      title: "FDU",
      field: "fund_dept_unit",
    },
    {
      title: "Amount",
      field: "funding_amount",
      render: row => currencyFormatter.format(row.funding_amount),
      type: "currency",
    },
  ];

  return (
    <ApolloErrorHandler errors={error}>
      <MaterialTable
        columns={columns}
        components={{
          EditRow: props => (
            <MTableEditRow
              {...props}
              onKeyDown={e => {
                if (e.keyCode === 13) {
                  // Bypass default MaterialTable behavior of submitting the entire form when a user hits enter
                  // See https://github.com/mbrn/material-table/pull/2008#issuecomment-662529834
                }
              }}
            />
          ),
          Action: props => {
            // Add action icons when for NOT "add"
            if (
              typeof props.action === typeof Function ||
              props.action.tooltip !== "Add"
            ) {
              return <MTableAction {...props} />;
            } else {
              // else add "Add ..." button
              return (
                <Button
                  className={classes.fundingButton}
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<AddCircleIcon />}
                  ref={addActionRef}
                  onClick={props.action.onClick}
                >
                  Add Funding Source
                </Button>
              );
            }
          },
        }}
        data={data.moped_proj_funding}
        title={
          <div>
            <Typography variant="h2" color="primary">
              Funding sources
            </Typography>
            <Typography variant="h5" color="textPrimary">
              eCAPRIS subproject ID:{" "}
              <ProjectSummaryProjectECapris
                projectId={projectId}
                data={data}
                refetch={refetch}
                snackbarHandle={snackbarHandle}
                classes={classes}
                hideHeader
                noWrapper
              />
            </Typography>
            <Box component={"ul"} className={classes.chipContainer}>
              {taskOrderData.map(task => (
                <li key={task.id}>
                  <Chip
                    // icon={icon}
                    label={`${task.id} | ${task.name}`}
                    onDelete={() => handleTaskOrderDelete(task)}
                    className={classes.chip}
                  />
                </li>
              ))}
              {!addTaskOrderMode && (
                <li key={`add-task-order`}>
                  <Tooltip title="Add New Task Order">
                    <ControlPointIcon
                      className={classes.editIconFunding}
                      onClick={handleAddTaskOrder}
                    />
                  </Tooltip>
                </li>
              )}
              {addTaskOrderMode && (
                <Box display="flex" justifyContent="flex-start">
                  <TaskOrderAutocomplete
                    props={{ onChange: handleTaskOrderOnChange }}
                    value={newTaskOrderList}
                  />
                  <Icon
                    className={classes.editIconConfirm}
                    onClick={handleNewTaskOrderSave}
                  >
                    check
                  </Icon>
                  <Icon
                    className={classes.editIconConfirm}
                    onClick={handleNewTaskOrderCancel}
                  >
                    close
                  </Icon>
                </Box>
              )}
            </Box>
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
        }}
        editable={{
          onRowAdd: newData =>
            addProjectFunding({
              variables: {
                objects: {
                  ...newData,
                  project_id: projectId,
                  added_by: getDatabaseId(user),
                  funding_status_id: 1,
                },
              },
            })
              .then(() => refetch())
              .catch(error => {
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
            delete updateProjectFundingData.added_by;
            delete updateProjectFundingData.date_added;
            // Format edited funding values to number value
            updateProjectFundingData.funding_amount = Number(
              newData.funding_amount
            );
            // add fallback of empty strings instead of null value
            updateProjectFundingData.fund_dept_unit =
              newData.fund_dept_unit || "";
            updateProjectFundingData.funding_description =
              newData.funding_description || "";
            updateProjectFundingData.funding_program_id =
              newData.funding_program_id || 0;

            return updateProjectFunding({
              variables: updateProjectFundingData,
            })
              .then(() => refetch())
              .catch(error => {
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
          onRowDelete: oldData =>
            deleteProjectFunding({
              variables: {
                proj_funding_id: oldData.proj_funding_id,
              },
            })
              .then(() => refetch())
              .catch(error => {
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
    </ApolloErrorHandler>
  );
};

export default ProjectFundingTable;
