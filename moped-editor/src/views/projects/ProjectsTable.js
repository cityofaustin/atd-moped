import React from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { NavLink as RouterLink } from "react-router-dom";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  makeStyles,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";

const useStyles = makeStyles(() => ({
  root: {},
  tableCell: {
    "text-transform": "capitalize",
  },
}));

const ProjectsTable = ({ projects }) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <PerfectScrollbar>
        <Box minWidth={1050}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell> </TableCell>
                <TableCell>Project Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date Added</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>Capitally Funded</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map(
                ({
                  project_id,
                  project_name,
                  project_description,
                  current_status,
                  date_added,
                  start_date,
                  capitally_funded,
                }) => (
                  <TableRow hover key={project_id}>
                    <TableCell align="center">
                      <RouterLink to={`/moped/projects/${project_id}`}>
                        <EditIcon color="primary" />
                      </RouterLink>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <RouterLink to={`/moped/projects/${project_id}`}>
                        {project_name}
                      </RouterLink>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {project_description}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {current_status.replace('"', "")}
                    </TableCell>
                    <TableCell>{date_added}</TableCell>
                    <TableCell>{start_date}</TableCell>
                    <TableCell>{capitally_funded ? "Yes" : "No"}</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};

export default ProjectsTable;
