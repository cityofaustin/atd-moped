import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";

/**
 * Custom table cell component which incoporates an optional handler to transform record values
 * @param { Object } row - a single Moped record object as returned from Hasura
 * @param { Object } column - a column definition object as defined in ./settings/SETTINGS
 * @returns { JSX } an MUI TableCell component with the row/column value
 */
const WrappedTableCell = ({ row, column: { key, handler } }) => {
  return <TableCell>{handler ? handler(row[key], row) : row[key]}</TableCell>;
};

/**
 * A generic table component that can display Moped records
 * @param { Object[] } rows - an array of records to be rendered in the table
 * @param { Object[] } columns - the column definitions as defined in the ./settings/SETTINGS object
 * @returns { JSX } a table of record data
 */
export default function RecordTable({ rows, columns, loading }) {
  return (
    <TableContainer>
      <Table aria-label="record table" size="small">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.key}>{column.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <CircularProgress />
              </TableCell>
            </TableRow>
          )}
          {rows?.map((row, i) => {
            return (
              <TableRow key={i}>
                {columns.map((column) => {
                  return (
                    <WrappedTableCell
                      row={row}
                      column={column}
                      key={column.key}
                    />
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
