import React from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

import {
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

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const ProjectActivityLog = () => {
  const { projectId } = useParams();
  const classes = useStyles();

  console.log("ProjectId: ", projectId);

  const { loading, error, data } = useQuery(PROJECT_ACTIVITY_LOG, {
    variables: { projectId },
  });

  if (loading) return <CircularProgress />;
  if (error) return `Error! ${error.message}`;

  const formatDate = value => new Date(value).toLocaleDateString();

  return (
    <CardContent>
      <h2 style={{ padding: "0rem 0 2rem 0" }}>Activity feed</h2>
      {data && "moped_activity_log" in data && (
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left"><b>Date</b></TableCell>
                <TableCell align="left"><b>User</b></TableCell>
                <TableCell align="left"><b>Change</b></TableCell>
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
                  >
                    {formatDate(change.created_at)}
                  </TableCell>
                  <TableCell align="left" width="25%">
                    {change.moped_user.first_name} {change.moped_user.last_name}
                  </TableCell>
                  <TableCell align="left" width="*">
                    <Grid container>
                      <Grid item style={{"padding": ".3rem"}}>
                        <Icon>create</Icon>
                      </Grid>
                      {change.description.map(changeItem => {
                        return (
                          <Grid item>
                            <b>{changeItem.field}</b> from{" "}
                            <b>{changeItem.old}</b> to <b>{changeItem.new}</b>
                          </Grid>
                        );
                      })}
                    </Grid>
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
