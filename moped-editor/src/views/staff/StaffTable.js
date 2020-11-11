import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import PerfectScrollbar from "react-perfect-scrollbar";
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

const useStyles = makeStyles(theme => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2),
  },
}));

const Results = ({ className, staff, ...rest }) => {
  const classes = useStyles();

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <PerfectScrollbar>
        <Box minWidth={1050}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell> </TableCell>
                <TableCell>First name</TableCell>
                <TableCell>Last name</TableCell>
                <TableCell>Workgroup</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {staff.map(person => (
                <TableRow hover key={person.staff_uuid}>
                  <TableCell>
                    <EditIcon />
                  </TableCell>
                  <TableCell>{person.first_name}</TableCell>
                  <TableCell>{person.last_name}</TableCell>
                  <TableCell>{person.workgroup}</TableCell>
                  <TableCell>{person.title}</TableCell>
                  <TableCell>{person.role}</TableCell>
                  <TableCell>{person.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  staff: PropTypes.array.isRequired,
};

export default Results;
