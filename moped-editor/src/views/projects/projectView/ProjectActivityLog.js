import React from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { ProjectActivityLogTableMaps } from "./ProjectActivityLogTableMaps";

import {
  Avatar,
  Box,
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

  const { loading, error, data } = useQuery(PROJECT_ACTIVITY_LOG, {
    variables: { projectId },
  });

  if (loading) return <CircularProgress />;
  if (error) return `Error! ${error.message}`;

  /**
   * Formats the iso date into human-readable locale date.
   * @param {string} date - The ISO date as a string
   * @return {string}
   */
  const formatDate = date => new Date(date).toLocaleDateString();

  return (
    <CardContent>
      <h2 style={{ padding: "0rem 0 2rem 0" }}>Activity feed</h2>
      {data && "moped_activity_log" in data && (
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
                  <b>Change</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data["moped_activity_log"].map(change => (
                <TableRow key={change.activity_id}>
                  <TableCell
                    align="left"
                    component="th"
                    scope="row"
                    width="15%"
                    className={classes.tableCell}
                  >
                    {formatDate(change.created_at)}
                  </TableCell>
                  <TableCell
                    align="left"
                    width="25%"
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
                    width="*"
                    className={classes.tableCell}
                  >
                    <Box display="flex" p={0}>
                      <Box p={0}>
                        <Icon>{getChangeIcon(change.record_type)}</Icon>
                      </Box>
                      <Box p={0} flexGrow={1}>
                        <Grid continer>
                          {change.description.map(changeItem => {
                            return (
                              <Grid item className={classes.tableChangeItem}>
                                <b>
                                  {getRecordTypeLabel(change.record_type)}{" "}
                                  {getHumanReadableField(
                                    change.record_type,
                                    changeItem.field
                                  )}
                                </b>{" "}
                                from <b>&quot;{changeItem.old}&quot;</b> to{" "}
                                <b>&quot;{changeItem.new}&quot;</b>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </CardContent>
  );
};

export default ProjectActivityLog;
