import React from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  CircularProgress,
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
    table: {
      minWidth: 650,
      margin: 20,
    },
  },
}));

const ProjectTeamTable = props => {
  const classes = useStyles();

  const handleAddRow = () => {
    let item = {
      id: props.StaffRows.length + 1,
      name: "",
      workgroup: "",
      role: "",
      notes: "",
    };
    props.setStaffRows(StaffRows => [...StaffRows, item]);
  };

  const handleRemoveRow = index => {
    if (props.StaffRows.length > 1)
      props.setStaffRows(StaffRows => StaffRows.slice(0, index));
  };

  const handleNameChange = (value, index) => {
    const updatedStaffRows = props.StaffRows.map((row, i) =>
      i === index ? { ...row, name: value } : row
    );

    props.setStaffRows(updatedStaffRows);
  };

  const handleRoleChange = (value, index) => {
    const updatedStaffRows = props.StaffRows.map((row, i) =>
      i === index ? { ...row, role: value } : row
    );

    props.setStaffRows(updatedStaffRows);
  };

  const handleNoteChange = (value, index) => {
    const updatedStaffRows = props.StaffRows.map((row, i) =>
      i === index ? { ...row, notes: value } : row
    );

    props.setStaffRows(updatedStaffRows);
  };

  const MEMBERS_QUERY = gql`
    query Members {
      moped_users(order_by: { last_name: asc }) {
        first_name
        last_name
        workgroup
      }
    }
  `;

  const ROLES_QUERY = gql`
    query Roles {
      moped_project_roles(order_by: { project_role_name: asc }) {
        project_role_name
      }
    }
  `;

  const {
    loading: membersLoading,
    error: membersError,
    data: members,
  } = useQuery(MEMBERS_QUERY);

  const { loading: roleLoading, error: roleError, data: roles } = useQuery(
    ROLES_QUERY
  );

  if (membersLoading) return <CircularProgress />;
  if (membersError) return `Error! ${membersError.message}`;

  if (roleLoading) return <CircularProgress />;
  if (roleError) return `Error! ${roleError.message}`;

  let nameOption = [];
  members.moped_users.forEach(name =>
    nameOption.push(name.first_name + " " + name.last_name)
  );

  let roleOption = [];
  roles.moped_project_roles.forEach(role =>
    roleOption.push(role.project_role_name)
  );

  return (
    <form style={{ padding: 10 }}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Row</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Workgroup</TableCell>
            <TableCell>Notes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.StaffRows.map((item, index) => {
            return (
              <TableRow key={index}>
                <TableCell>{item.id}</TableCell>
                <TableCell>
                  <Autocomplete
                    id="selectedName"
                    name="Name"
                    options={nameOption}
                    getOptionLabel={option => option || ""}
                    onChange={(event, value) => {
                      handleNameChange(value, index);
                      // TODO: Handle workgroup update
                    }}
                    defaultValue={item.name}
                    style={{ width: 200 }}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label="Select Staff"
                        margin="normal"
                      />
                    )}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    name="Group"
                    value={item.workgroup}
                    style={{ width: 200, paddingLeft: 10, marginBottom: -13 }}
                  />
                </TableCell>
                <TableCell>
                  <Autocomplete
                    id="selectedRole"
                    name="Role"
                    options={roleOption}
                    defaultValue={item.role}
                    onChange={(event, value) => {
                      handleRoleChange(value, index);
                    }}
                    style={{ width: 200 }}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label="Select a Role"
                        margin="normal"
                      />
                    )}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    name="Notes"
                    style={{ width: 200, paddingLeft: 10 }}
                    multiline
                    inputProps={{ maxLength: 75 }}
                    variant="outlined"
                    helperText="75 character max"
                    value={props.StaffRows[index].notes}
                    onChange={e => handleNoteChange(e.target.value, index)}
                  />
                </TableCell>
                <TableCell>
                  <DeleteIcon
                    color="secondary"
                    onClick={() => {
                      handleRemoveRow(index);
                    }}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <PersonAddIcon
        color="secondary"
        onClick={handleAddRow}
        style={{ paddingLeft: 10, fontSize: 35 }}
      />
    </form>
  );
};
export default ProjectTeamTable;
