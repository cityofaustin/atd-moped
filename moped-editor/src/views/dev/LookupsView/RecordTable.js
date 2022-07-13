import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { COLUMNS } from "./settings";

const WrappedTableCell = ({ row, column: { key, handler } }) => {
  return <TableCell>{handler ? handler(row[key]) : row[key]}</TableCell>;
};

export default function RecordTable({ rows, name }) {
  const columns = COLUMNS[name];
  return (
    <TableContainer>
      <Table aria-label="simple table" size="small">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.key}>{column.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => {
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
