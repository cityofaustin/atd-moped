import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { useActivityLogLookupTables } from "../../../utils/activityLogHelpers";
import {
  getOperationName,
  getChangeIcon,
  getRecordTypeLabel,
  getHumanReadableField,
  ProjectActivityLogGenericDescriptions,
} from "./ProjectActivityLogTableMaps";

import ProjectActivityLogDialog from "./ProjectActivityLogDialog";

import {
  Avatar,
  Box,
  Button,
  CardContent,
  CircularProgress,
  Grid,
  Icon,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";

import { PROJECT_ACTIVITY_LOG } from "../../../queries/project";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Alert } from "@material-ui/lab";
import ApolloErrorHandler from "../../../components/ApolloErrorHandler";

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 650,
  },
  tableCell: {
    verticalAlign: "top",
  },
  tableChangeItem: {
    padding: "0 .5rem",
  },
  avatarSmall: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  avatarName: {
    margin: "0.3rem 0 0 .5rem",
  },
}));

const ProjectActivityLog = () => {
  const { projectId } = useParams();
  const classes = useStyles();

  const {
    getLookups,
    lookupLoading,
    lookupError,
    lookupMap,
  } = useActivityLogLookupTables();

  const { loading, error, data } = useQuery(PROJECT_ACTIVITY_LOG, {
    variables: { projectId },
    onCompleted: data => getLookups(data, "activity_log_lookup_tables"),
  });

  const [activityId, setActivityId] = useState(null);

  /**
   * Closes the details dialog
   */
  const handleDetailsClose = () => {
    setActivityId(null);
  };

  /**
   * Opens the details dialog
   * @param {string} activityId - The activity uuid
   */
  const handleDetailsOpen = activityId => {
    setActivityId(activityId);
  };

  if (loading || lookupLoading) return <CircularProgress />;

  /**
   * Formats the iso date into human-readable locale date.
   * @param {string} date - The ISO date as a string
   * @return {string}
   */
  const formatDate = date => new Date(date).toLocaleDateString();

  /**
   * Safely returns the initials from a full name
   * @param {string} name - The full name of the user
   * @return {string}
   */
  const getInitials = name =>
    name
      .replace(/[^A-Za-z0-9À-ÿ ]/gi, "")
      .replace(/ +/gi, " ")
      .split(/ /)
      .reduce((acc, item) => acc + item[0], "")
      .concat(name.substr(1))
      .concat(name)
      .substr(0, 2)
      .toUpperCase();

  /**
   * Based on an operation type, returns the name of the label if there are no differences,
   * @param {string} operationType - The name of the operation ty[e
   * @return {string}
   */
  const getLabelNoDiff = operationType => {
    switch (operationType.toLowerCase()) {
      case "insert": {
        return "Record Created";
      }
      case "delete": {
        return "Item Deleted";
      }
      default: {
        return "No difference";
      }
    }
  };

  /**
   * Attempt to get the number of items we retrieved
   * @return {number}
   */
  const getTotalItems = () => {
    return data?.moped_activity_log?.length ?? 0;
  };

  /**
   * Returns True if the field should be a generic type (i.e., maps, objects)
   * @param {string} field - The field name (column name)
   * @return {boolean} - True if the field is contained in the ProjectActivityLogGenericDescriptions object
   */
  const isFieldGeneric = field =>
    field in ProjectActivityLogGenericDescriptions;

  /**
   * Makes sure the creation of the project always comes first
   * @param {Array} eventList - The data object as provided by apollo
   * @return {Array}
   */
  const reorderEventList = eventList => {
    let outputList = [];
    // For each event
    eventList.forEach(event => {
      // If this is the creation of a project
      if (
        event.record_type === "moped_project" &&
        event.operation_type === "INSERT"
      ) {
        // Move it to the top of the list (make it first)
        outputList.unshift(event);
      } else {
        // Else, just stack it to the bottom
        outputList.push(event);
      }
    });

    return outputList;
  };

  return (
    <ApolloErrorHandler error={error || lookupError}>
      <CardContent>
        <h2 style={{ padding: "0rem 0 2rem 0" }}>Activity feed</h2>
        {getTotalItems() === 0 ? (
          <Alert severity="info">
            There aren't any items for this project.
          </Alert>
        ) : (
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">
                    <b>Date</b>
                  </TableCell>
                  <TableCell align="left">
                    <b>User</b>
                  </TableCell>
                  <TableCell align="left">
                    <b>Action</b>
                  </TableCell>
                  <TableCell align="left">
                    <b>Change</b>
                  </TableCell>
                  <TableCell align="left"> </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reorderEventList(data["moped_activity_log"]).map(change => (
                  <TableRow key={change.activity_id}>
                    {console.log("Change: ", change)}
                    <TableCell
                      align="left"
                      component="th"
                      scope="row"
                      width="5%"
                      className={classes.tableCell}
                    >
                      {formatDate(change.created_at)}
                    </TableCell>
                    <TableCell
                      align="left"
                      width="15%"
                      className={classes.tableCell}
                    >
                      <Box display="flex" p={0}>
                        <Box p={0}>
                          <Avatar
                            alt={`${change.moped_user.first_name} ${change.moped_user.last_name}`}
                            src="/moped/static/images/avatars/userAvatar.jpg"
                            className={classes.avatarSmall}
                          >
                            {getInitials(
                              `${change.moped_user.first_name} ${change.moped_user.last_name}`
                            )}
                          </Avatar>
                        </Box>
                        <Box p={0} flexGrow={1} className={classes.avatarName}>
                          {change.moped_user.first_name}{" "}
                          {change.moped_user.last_name}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell
                      align="left"
                      width="5%"
                      className={classes.tableCell}
                    >
                      <b>{getOperationName(change.operation_type, change.record_type)}</b>
                    </TableCell>
                    <TableCell
                      align="left"
                      width="70%"
                      className={classes.tableCell}
                    >
                      <Box display="flex" p={0}>
                        <Box p={0}>
                          <Icon>{getChangeIcon(change.operation_type, change.record_type)}</Icon>
                        </Box>
                        <Box p={0} flexGrow={1}>
                          <Grid continer>
                            {Array.isArray(change.description) &&
                              change.description.length === 0 &&
                              change.record_type === "moped_project" && (
                                <Grid item className={classes.tableChangeItem}>
                                  <b>{getLabelNoDiff(change.operation_type)}</b>
                                </Grid>
                              )}

                            {change.description.map(changeItem => {
                              return (
                                <Grid item className={classes.tableChangeItem}>
                                  {isFieldGeneric(changeItem.field) ? (
                                    <b>
                                      {
                                        ProjectActivityLogGenericDescriptions[
                                          changeItem.field
                                        ]?.label
                                      }
                                    </b>
                                  ) : (
                                    <>
                                      <b>
                                        {getRecordTypeLabel(change.record_type)}{" "}
                                        {getHumanReadableField(
                                          change.record_type,
                                          changeItem.field
                                        )}
                                      </b>{" "}
                                      from{" "}
                                      <b>
                                        &quot;
                                        {lookupMap?.[change.record_type]?.[
                                          changeItem.field
                                        ]?.[changeItem.old] ||
                                          String(changeItem.old)}
                                        &quot;
                                      </b>{" "}
                                      to{" "}
                                      <b>
                                        &quot;
                                        {lookupMap?.[change.record_type]?.[
                                          changeItem.field
                                        ]?.[changeItem.new] ||
                                          String(changeItem.new)}
                                        &quot;
                                      </b>
                                    </>
                                  )}
                                </Grid>
                              );
                            })}
                          </Grid>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell width="5%">
                      <Button
                        onClick={() => handleDetailsOpen(change.activity_id)}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {!!activityId && (
          <ProjectActivityLogDialog
            activity_id={activityId}
            handleClose={handleDetailsClose}
          />
        )}
      </CardContent>
    </ApolloErrorHandler>
  );
};

export default ProjectActivityLog;
