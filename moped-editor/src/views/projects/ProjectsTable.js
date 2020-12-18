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
  Link,
  Chip,
  Icon,
} from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {},
  tableCell: {
    "text-transform": "capitalize",
  },
}));

const ProjectsTable = ({ projects }) => {
  const classes = useStyles();

  /**
   * Parses a PostgreSQL timestamp string and returns a human-readable date-time string
   * @param {string} date - The date as provided by the database
   * @return {string}
   */
  const parseDateReadable = date => {
    return new Date(date).toLocaleDateString();
  };

  /**
   * Removes any non-alphanumeric characters from a string
   * @param {str} input - The text to be cleaned
   * @returns {str}
   */
  const cleanUpText = input => {
    return String(input).replace(/[^0-9a-z]/gi, "");
  };

  /**
   * Returns a Chip object containing the status of the project.
   * @param {str} status - The status of the project as string
   * @return {JSX.Element}
   */
  const getProjectStatus = status => {
    const statusColorMap = {
      active: "primary",
      hold: "secondary",
      canceled: "disabled",
    };

    const statusLabel = cleanUpText(status);
    return String(status) !== "" ? (
      <Chip
        color={statusColorMap[statusLabel.toLowerCase()] || "disabled"}
        size={"small"}
        label={statusLabel}
      />
    ) : (
      <span>No Status</span>
    );
  };
  
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
                <TableCell>Capital Funding</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map(project => (
                <TableRow hover key={project.project_id}>
                  <TableCell align="center">
                    <RouterLink to={`/moped/projects/${project.project_id}`}>
                      <Icon color={"primary"}>edit_road</Icon>
                    </RouterLink>
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    <Link href={"/moped/projects/" + project.project_id}>
                      {project.project_name}
                    </Link>
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {project.project_description}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {getProjectStatus(project.current_status)}
                  </TableCell>
                  <TableCell>{parseDateReadable(project.date_added)}</TableCell>
                  <TableCell>{parseDateReadable(project.start_date)}</TableCell>
                  <TableCell>
                    {project.capitally_funded ? "Yes" : "No"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};

export default ProjectsTable;
