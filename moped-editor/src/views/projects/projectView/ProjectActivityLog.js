import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { isEqual } from "lodash";

import {
  Box,
  CardContent,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";

import { PROJECT_ACTIVITY_LOG } from "../../../queries/project";
import makeStyles from "@mui/styles/makeStyles";
import { Alert } from "@mui/material";
import ApolloErrorHandler from "../../../components/ApolloErrorHandler";
import CDNAvatar from "../../../components/CDN/Avatar";
import typography from "src/theme/typography";
import { formatRelativeDate } from "src/utils/dateAndTime";
import { getUserFullName, getInitials } from "../../../utils/userNames";
import ProjectActivityEntry from "./ProjectActivityEntry";

import { formatActivityLogEntry } from "../../../utils/activityLogHelpers";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  tableCell: {
    verticalAlign: "top",
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
  mutedDate: {
    display: "block",
    fontSize: ".75rem",
    color: theme.palette.text.secondary,
  },
}));

/**
 * Memoized object containing lookup tables
 */
const useLookupTables = (data) =>
  useMemo(() => {
    const lookupData = {};

    lookupData.userList = {};
    lookupData.phaseList = {};
    lookupData.subphaseList = {};
    lookupData.tagList = {};
    lookupData.entityList = {};
    lookupData.fundingSources = {};
    lookupData.fundingPrograms = {};
    lookupData.fundingStatus = {};
    lookupData.milestoneList = {};
    lookupData.publicProcessStatusList = {};
    lookupData.componentList = {};
    lookupData.projectTypeList = {};

    if (data) {
      data["moped_users"].forEach((user) => {
        lookupData.userList[`${user.user_id}`] = getUserFullName(user);
      });
      data["moped_phases"].forEach((phase) => {
        lookupData.phaseList[`${phase.phase_id}`] = phase.phase_name;
      });
      data["moped_subphases"].forEach((subphase) => {
        lookupData.subphaseList[`${subphase.subphase_id}`] =
          subphase.subphase_name;
      });
      data["moped_tags"].forEach((tag) => {
        lookupData.tagList[`${tag.id}`] = tag.name;
      });
      data["moped_entity"].forEach((entity) => {
        lookupData.entityList[`${entity.entity_id}`] = entity.entity_name;
      });
      data["moped_fund_sources"].forEach((fundSource) => {
        lookupData.fundingSources[`${fundSource.funding_source_id}`] =
          fundSource.funding_source_name;
      });
      data["moped_fund_programs"].forEach((fundProgram) => {
        lookupData.fundingPrograms[`${fundProgram.funding_program_id}`] =
          fundProgram.funding_program_name;
      });
      data["moped_fund_status"].forEach((fundStatus) => {
        lookupData.fundingStatus[`${fundStatus.funding_status_id}`] =
          fundStatus.funding_status_name;
      });
      data["moped_milestones"].forEach((milestone) => {
        lookupData.milestoneList[`${milestone.milestone_id}`] =
          milestone.milestone_name;
      });
      data["moped_public_process_statuses"].forEach((publicProcessStatus) => {
        lookupData.publicProcessStatusList[`${publicProcessStatus.id}`] =
          publicProcessStatus.name;
      });
      data["moped_components"].forEach((component) => {
        lookupData.componentList[`${component.component_id}`] = `${
          component.component_name
        }${
          component.component_subtype ? ` - ${component.component_subtype}` : ""
        }`;
      });
      data["moped_types"].forEach((projectType) => {
        lookupData.projectTypeList[`${projectType.type_id}`] =
          projectType.type_name;
      });
    }

    return lookupData;
  }, [data]);

/**
 * Updates the description field with newData and oldData
 * Makes sure the project creation event is the last in the returned Array
 * @param {Array} eventList - The data object as provided by apollo
 * @returns {Array}
 */
const usePrepareActivityData = (activityData) =>
  useMemo(() => {
    if (!activityData) {
      return [];
    }
    let outputList = [];
    let createdEvent = {};
    activityData.forEach((event) => {
      let outputEvent = { ...event };
      // if the description includes "newSchema", we need to manually find the difference in the update
      if (event.description[0]?.newSchema) {
        // if event is an INSERT there is no previous record to compare to
        if (event.operation_type === "INSERT") {
          outputEvent.description = [];
        } else {
          // otherwise compare the old record to the new record to find the field that was updated
          const newData = outputEvent.record_data.event.data.new;
          const oldData = outputEvent.record_data.event.data.old;
          let changedField = "";
          Object.keys(newData).forEach((key) => {
            if (!!newData[key] && typeof newData[key] === "object") {
              if (!isEqual(newData[key], oldData[key])) {
                changedField = key;
              }
            } else if (newData[key] !== oldData[key] && key !== "updated_at") {
              changedField = key;
            }
          });
          outputEvent.description = [
            {
              new: newData,
              old: oldData,
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
  }, [activityData]);

/**
 * Get the number of items retrieved
 * @return {number}
 */
const getTotalItems = (data) => {
  return data?.moped_activity_log?.length ?? 0;
};

const ProjectActivityLog = () => {
  const { projectId } = useParams();
  const classes = useStyles();

  const { loading, error, data } = useQuery(PROJECT_ACTIVITY_LOG, {
    variables: { projectId },
  });

  const activityLogData = usePrepareActivityData(data?.moped_activity_log);
  const lookupData = useLookupTables(data);

  if (loading) return <CircularProgress />;

  return (
    <ApolloErrorHandler error={error}>
      <CardContent>
        {getTotalItems(data) === 0 ? (
          <Alert severity="info">
            There is no activity recorded for this project.
          </Alert>
        ) : (
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableBody>
                {activityLogData.map((change) => {
                  const { changeIcon, changeText } = formatActivityLogEntry(
                    change,
                    lookupData,
                    projectId
                  );
                  // allows log formatters to return a `null` changeText, causing the
                  // event to not be rendered at all
                  if (!changeText) {
                    return null;
                  }
                  return (
                    <TableRow key={change.activity_id}>
                      <TableCell
                        align="left"
                        width="15%"
                        className={classes.tableCell}
                      >
                        <Box display="flex" p={0}>
                          <Box p={0}>
                            <CDNAvatar
                              className={classes.avatarSmall}
                              src={change?.updated_by_user?.picture}
                              initials={getInitials(change?.updated_by_user)}
                              // todo: do we want this to not be always gray if its just the initials?
                              userColor={null}
                            />
                          </Box>
                          <Box
                            p={0}
                            flexGrow={1}
                            className={classes.avatarName}
                          >
                            {getUserFullName(change?.updated_by_user)}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell
                        align="left"
                        width="80%"
                        className={classes.tableCell}
                      >
                        <ProjectActivityEntry
                          changeIcon={changeIcon}
                          changeText={changeText}
                        />
                      </TableCell>
                      <TableCell
                        align="left"
                        component="th"
                        scope="row"
                        width="5%"
                        className={classes.tableCell}
                        style={{ whiteSpace: "nowrap" }}
                      >
                        <span>
                          {change.created_at
                            ? formatRelativeDate(change.created_at)
                            : ""}
                        </span>
                        <span className={classes.mutedDate}>
                          {change.created_at
                            ? new Date(change.created_at).toLocaleString()
                            : ""}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </ApolloErrorHandler>
  );
};

export default ProjectActivityLog;
