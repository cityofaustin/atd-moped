import React from "react";
import ProjectTeamTable from "../projectView/ProjectTeamTable";
import { useQuery, gql } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import { CircularProgress } from "@material-ui/core";

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

const MEMBERS_QUERY = gql`
  query Members {
    moped_users(
      order_by: { last_name: asc }
      where: { status_id: { _eq: 1 } }
    ) {
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

const NewProjectTeam = ({ personnel, setPersonnel }) => {
  const classes = useStyles();

  const {
    loading: membersLoading,
    error: membersError,
    data: members,
  } = useQuery(MEMBERS_QUERY);

  const { loading: roleLoading, error: roleError, data: roles } = useQuery(
    ROLES_QUERY
  );

  const handleAddRow = () => {
    let item = {
      id: props.StaffRows.length + 1,
      name: "",
      workgroup: "",
      role_name: "",
      notes: "",
    };
    props.setStaffRows(StaffRows => [...StaffRows, item]);
  };

  const handleRemoveRow = index => {
    const updatedStaffRows = props.StaffRows.filter((row, i) => i !== index);

    props.setStaffRows(updatedStaffRows);
  };

  const handleNameAndWorkgroupChange = (value, index) => {
    const updatedName = value?.name || null;
    const updatedWorkgroup = value?.workgroup || null;

    const updatedStaffRows = props.StaffRows.map((row, i) =>
      i === index
        ? { ...row, name: updatedName, workgroup: updatedWorkgroup }
        : row
    );

    props.setStaffRows(updatedStaffRows);
  };

  const handleRoleChange = (value, index) => {
    const updatedStaffRows = props.StaffRows.map((row, i) =>
      i === index ? { ...row, role_name: value } : row
    );

    props.setStaffRows(updatedStaffRows);
  };

  const handleNoteChange = (value, index) => {
    const updatedStaffRows = props.StaffRows.map((row, i) =>
      i === index ? { ...row, notes: value } : row
    );

    props.setStaffRows(updatedStaffRows);
  };

  if (membersLoading) return <CircularProgress />;
  if (membersError) return `Error! ${membersError.message}`;

  if (roleLoading) return <CircularProgress />;
  if (roleError) return `Error! ${roleError.message}`;

  let userOptions = [];
  members.moped_users.forEach(user =>
    userOptions.push({
      name: user.first_name + " " + user.last_name,
      workgroup: user.workgroup,
    })
  );

  let roleOptions = [];
  roles.moped_project_roles.forEach(role =>
    roleOptions.push(role.project_role_name)
  );

  return (
    <form style={{ padding: 25 }}>
      <ProjectTeamTable personnel={personnel} setPersonnel={setPersonnel} />
      {/* <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Notes</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.StaffRows.map((item, index) => {
            return (
              <TableRow key={index}>
                <TableCell className={classes.cell}>
                  <Autocomplete
                    id="selectedName"
                    name="Name"
                    options={userOptions}
                    getOptionLabel={option => option.name || option}
                    getOptionSelected={(option, value) => {
                      return option.name === value;
                    }}
                    value={item.name || null}
                    onChange={(event, value) => {
                      handleNameAndWorkgroupChange(value, index);
                    }}
                    style={{ width: 250 }}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label="Select Staff"
                        margin="normal"
                        helperText={item.workgroup || " "}
                      />
                    )}
                  />
                </TableCell>
                <TableCell>
                  <Autocomplete
                    id="selectedRole"
                    name="Role"
                    options={roleOptions}
                    value={item.role_name || null}
                    onChange={(event, value) => {
                      handleRoleChange(value, index);
                    }}
                    style={{ width: 250 }}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label="Select a Role"
                        margin="normal"
                        helperText=" "
                      />
                    )}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    name="Notes"
                    style={{ width: 250, paddingLeft: 10 }}
                    multiline
                    inputProps={{ maxLength: 75 }}
                    variant="outlined"
                    helperText="75 character max"
                    value={props.StaffRows[index].notes}
                    onChange={e => handleNoteChange(e.target.value, index)}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="secondary"
                    aria-label="remove staff"
                    component="span"
                    onClick={() => {
                      handleRemoveRow(index);
                    }}
                  >
                    <DeleteIcon color="secondary" />{" "}
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <IconButton
              style={{ marginLeft: 25, marginTop: 25 }}
              color="primary"
              aria-label="add staff"
              component="td"
              onClick={handleAddRow}
            >
              <PersonAddIcon color="primary" />
            </IconButton>
          </TableRow>
        </TableFooter>
      </Table> */}
    </form>
  );
};
export default NewProjectTeam;
