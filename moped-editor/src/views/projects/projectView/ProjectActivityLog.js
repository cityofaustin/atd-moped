import React from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { useActivityLogLookupTables } from "../../../utils/activityLogHelpers";
import {
  fieldFormat,
  getCreationLabel,
  getOperationName,
  getChangeIcon,
  getRecordTypeLabel,
  getHumanReadableField,
  getMappedValue,
  isFieldMapped,
  ProjectActivityLogGenericDescriptions,
} from "./ProjectActivityLogTableMaps";

// import ProjectActivityLogDialog from "./ProjectActivityLogDialog";

import {
  Box,
  // Button,
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
import CDNAvatar from "../../../components/CDN/Avatar";
import typography from "src/theme/typography";
import { formatTimeStampTZType } from "src/utils/dateAndTime";
import { getUserFullName, getInitials } from "../../../utils/userNames";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  tableCell: {
    verticalAlign: "top",
  },
  updateGridEntries: {
    display: "block",
    padding: "0 0 0 .5rem",
  },
  tableChangeItem: {
    padding: "0 .5rem 0 0",
  },
  avatarSmall: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  avatarName: {
    margin: "0.3rem 0 0 .5rem",
  },
  projectPageHeader: {
    fontFamily: typography.fontFamily,
    padding: "0rem 0 2rem 0",
  },
  boldText: {
    fontWeight: 700,
  },
}));

const ProjectActivityLog = () => {
  const { projectId } = useParams();
  const classes = useStyles();
  const userList = {};
  const phaseList = {};

  const { getLookups, lookupLoading, lookupError } =
    useActivityLogLookupTables();

  const { loading, error, data } = useQuery(PROJECT_ACTIVITY_LOG, {
    variables: { projectId },
    onCompleted: (data) => getLookups(data, "activity_log_lookup_tables"),
  });
  // const [activityId, setActivityId] = useState(null);

  /**
   * Closes the details dialog
   */
  // const handleDetailsClose = () => {
  //   setActivityId(null);
  // };

  /**
   * Opens the details dialog
   * @param {string} activityId - The activity uuid
   */
  // const handleDetailsOpen = activityId => {
  //   setActivityId(activityId);
  // };

  if (loading || lookupLoading) return <CircularProgress />;

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
  const isFieldGeneric = (field) =>
    field in ProjectActivityLogGenericDescriptions;

  /**
   * if event is from new schema, finds the updated difference and includes in the object
   * Makes sure the project creation event is the last in the returned Array
   * @param {Array} eventList - The data object as provided by apollo
   * @returns {Array}
   */
  const getDiffs = (eventList) => {
    let outputList = [];
    let createdEvent = {};
    eventList.forEach((event) => {
      let outputEvent = { ...event };
      // if the description includes "newSchema", we need to manually find the difference in the update
      if (event.description[0]?.newSchema) {
        // if event is an INSERT there is no previous record to compare to
        if (event.operation_type === "INSERT") {
          outputEvent.description = [];
        } else {
          // otherwise compare the old record to the new record to find the field that was updated
          const newData = outputEvent.record_data.data.new;
          const oldData = outputEvent.record_data.data.old;
          let changedField = "";
          Object.keys(newData).forEach((key) => {
            if (newData[key] !== oldData[key]) {
              changedField = key;
            }
          });
          outputEvent.description = [
            {
              new: newData[changedField],
              old: oldData[changedField],
              field: changedField,
            },
          ];
        }
      }
      outputList.push(outputEvent);

      // If this is the creation of a project, make a copy of it
      // so we can make sure it shows up at the bottom of the list
      if (
        outputEvent.record_type === "moped_project" &&
        outputEvent.operation_type === "INSERT"
      ) {
        createdEvent = outputEvent;
      }
    });

    // remove the project creation event from the array, and tack on to the end
    if (createdEvent["record_type"]) {
      outputList.splice(outputList.indexOf(createdEvent), 1);
      outputList.push(createdEvent);
    }

    return outputList;
  };

  if (data) {
    data["moped_users"].forEach((user) => {
      userList[`${user.user_id}`] = getUserFullName(user);
    });
    data["moped_phases"].forEach((phase) => {
      phaseList[`${phase.phase_id}`] = phase.phase_name;
    });
  }

  return (
    <ApolloErrorHandler error={error || lookupError}>
      <CardContent>
        <h2 className={classes.projectPageHeader}>Activity feed</h2>
        {getTotalItems() === 0 ? (
          <Alert severity="info">
            There aren't any items for this project.
          </Alert>
        ) : (
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left" className={classes.boldText}>
                    Date
                  </TableCell>
                  <TableCell align="left" className={classes.boldText}>
                    User
                  </TableCell>
                  <TableCell align="left" className={classes.boldText}>
                    Action
                  </TableCell>
                  <TableCell align="left" className={classes.boldText}>
                    Change
                  </TableCell>
                  <TableCell align="left" />
                </TableRow>
              </TableHead>
              <TableBody>
                {getDiffs(data["moped_activity_log"]).map((change) => {
                  return (
                    <TableRow key={change.activity_id}>
                      <TableCell
                        align="left"
                        component="th"
                        scope="row"
                        width="5%"
                        className={classes.tableCell}
                      >
                        {formatTimeStampTZType(change.created_at)}
                      </TableCell>
                      <TableCell
                        align="left"
                        width="15%"
                        className={classes.tableCell}
                      >
                        <Box display="flex" p={0}>
                          <Box p={0}>
                            <CDNAvatar
                              className={classes.avatarSmall}
                              // until we update the events in the activity log to use the user id
                              // instead of the cognito id, we have to check both places
                              src={
                                change?.moped_user?.picture ??
                                change?.updated_by_user?.picture
                              }
                              initials={getInitials(
                                change?.moped_user ?? change?.updated_by_user
                              )}
                              userColor={null}
                            />
                          </Box>
                          <Box
                            p={0}
                            flexGrow={1}
                            className={classes.avatarName}
                          >
                            {getUserFullName(
                              change?.moped_user ?? change?.updated_by_user
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell
                        align="left"
                        width="5%"
                        className={classes.tableCell}
                      >
                        {getOperationName(
                          change.operation_type,
                          change.record_type // todo: could this be better
                        )}
                      </TableCell>
                      <TableCell
                        align="left"
                        // if the details link comes back, this goes back to 70%
                        width="75%"
                        className={classes.tableCell}
                      >
                        <Box display="flex" p={0}>
                          <Box p={0}>
                            <Icon>
                              {getChangeIcon(
                                change.operation_type,
                                change.record_type
                              )}
                            </Icon>
                          </Box>
                          <Box p={0} flexGrow={1}>
                            <Grid
                              container
                              className={classes.updateGridEntries}
                            >
                              {Array.isArray(change.description) &&
                                change.description.length === 0 && (
                                  <Grid
                                    item
                                    className={classes.tableChangeItem}
                                  >
                                    <span className={classes.boldText}>
                                      {getCreationLabel(
                                        change,
                                        userList,
                                        phaseList
                                      )}
                                    </span>
                                  </Grid>
                                )}
                              {change.description.map((changeItem) => {
                                return (
                                  <Grid
                                    item
                                    className={classes.tableChangeItem}
                                  >
                                    {isFieldGeneric(changeItem.field) ? (
                                      <span className={classes.boldText}>
                                        {
                                          ProjectActivityLogGenericDescriptions[
                                            changeItem.field
                                          ]?.label
                                        }
                                      </span>
                                    ) : (
                                      <>
                                        <span className={classes.boldText}>
                                          {getRecordTypeLabel(
                                            change.record_type
                                          )}{" "}
                                          {getHumanReadableField(
                                            change.record_type,
                                            changeItem.field
                                          )}
                                        </span>
                                        &nbsp;from&nbsp;
                                        <span className={classes.boldText}>
                                          {isFieldMapped(
                                            change.record_type,
                                            changeItem.field
                                          )
                                            ? getMappedValue(
                                                change.record_type,
                                                changeItem.field,
                                                String(changeItem.old)
                                              )
                                            : fieldFormat(changeItem.old)}
                                        </span>
                                        &nbsp;to&nbsp;
                                        <span className={classes.boldText}>
                                          {isFieldMapped(
                                            change.record_type,
                                            changeItem.field
                                          )
                                            ? getMappedValue(
                                                change.record_type,
                                                changeItem.field,
                                                String(changeItem.new)
                                              )
                                            : fieldFormat(changeItem.new)}
                                        </span>
                                      </>
                                    )}
                                  </Grid>
                                );
                              })}
                            </Grid>
                          </Box>
                        </Box>
                      </TableCell>
                      {
                        // <TableCell width="5%">
                        //   <Button
                        //     onClick={() => handleDetailsOpen(change.activity_id)}
                        //   >
                        //     Details
                        //   </Button>
                        // </TableCell>
                      }
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {/*        {!!activityId && (
          <ProjectActivityLogDialog
            activity_id={activityId}
            handleClose={handleDetailsClose}
          />
        )}*/}
      </CardContent>
    </ApolloErrorHandler>
  );
};

export default ProjectActivityLog;
