import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  makeStyles
} from '@material-ui/core';
import getInitials from 'src/utils/getInitials';
import axios from axios

// Use local API dev server for now
const LOCAL_URI = `http://127.0.0.1:5000/` 

// Custom Hook for API calls
function useApi(url) {
  const [result, setResult] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(url).then(res => {
      setResult(res.data);
      setLoading(false);
    });
  }, [url]);

  return [result, loading];
}

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, staff, ...rest }) => {
  const classes = useStyles();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <PerfectScrollbar>
        <Box minWidth={1050}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Name
                </TableCell>
                <TableCell>
                  Email
                </TableCell>
                <TableCell>
                  Location
                </TableCell>
                <TableCell>
                  Phone
                </TableCell>
                <TableCell>
                  Registration date
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {staff.slice(0, limit).map((customer) => (
                <TableRow
                  hover
                  key={customer.id}
                >
                  <TableCell>
                    <Box
                      alignItems="center"
                      display="flex"
                    >
                      <Avatar
                        className={classes.avatar}
                        src={customer.avatarUrl}
                      >
                        {getInitials(customer.name)}
                      </Avatar>
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {customer.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {customer.email}
                  </TableCell>
                  <TableCell>
                    {`${customer.address.city}, ${customer.address.state}, ${customer.address.country}`}
                  </TableCell>
                  <TableCell>
                    {customer.phone}
                  </TableCell>
                  <TableCell>
                    {moment(customer.createdAt).format('DD/MM/YYYY')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={staff.length}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  staff: PropTypes.array.isRequired
};

export default Results;
