import React from "react";
import { TextField } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableHead, TableRow, Card, Container } from '@material-ui/core';
import Page from "src/components/Page";
 
const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
    table: {
      minWidth: 650,
      margin: 20
    }
  },
}));

const ProjectTeamTable = ( props ) => {

  const classes = useStyles();
 
  const handleAddRow = () => {
    let item = {
      id: props.StaffRows.length + 1,
      name: '',
      workgroup: '',
      role: ''
    };
    props.setStaffRows(StaffRows => [...StaffRows, item]);
  };

  const handleRemoveRow = (index) => {
    if(props.StaffRows.length > 1) props.setStaffRows(props.StaffRows.slice(0, index));
  };

  const handleNameChange = (value, item, index) => {
    item.name = value;
    props.setStaffRows(props.StaffRows);
  };

  const handleRoleChange = (value, item, index) => {
    item.role = value;
    props.setStaffRows(props.StaffRows);
  };

  const handleGroupChange = (value, item, index) => {
    item.workgroup = value.workgroup;
    props.setStaffRows(props.StaffRows);
  }

  const MEMBERS_QUERY = gql`
    query Members {
      moped_coa_staff(order_by: {last_name: asc}) {
        full_name
        first_name
        last_name
        workgroup
        staff_id
      }
    }
  `;

  const ROLES_QUERY = gql`
  query Roles {
    moped_project_roles(order_by: {project_role_name: asc}) {
      project_role_name
    }
  }
`;

  const { loading: membersLoading, error: membersError, data: members }  = useQuery(MEMBERS_QUERY);

  const { loading: roleLoading, error: roleError, data: roles } = useQuery(ROLES_QUERY);

  if (membersLoading) return 'Loading...';
  if (membersError) return `Error! ${membersError.message}`;

  if (roleLoading) return 'Loading...';
  if (roleError) return `Error! ${roleError.message}`;

  let nameOption = [];
  members.moped_coa_staff.forEach((name) => nameOption.push({name: name.first_name + " " + name.last_name, workgroup: name.workgroup}));

  let roleOption = [];
  roles.moped_project_roles.forEach((role) => roleOption.push(role.project_role_name));

  return (
    <Page className={classes.root} title="Map Project">
      <Container maxWidth={false}>
        <Card>
          <div>
            <form style={{padding: 10}}>
            <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Row</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Workgroup</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.StaffRows.map((item, index) => (
                <TableRow key={index}>
                <TableCell>{item.id}</TableCell>
                <TableCell>
                  <Autocomplete 
                      id="selectedName"
                      name="Name"
                      options={nameOption}
                      getOptionLabel={(option) => option.name ? option.name : ""}
                      onChange = {(event, value) => {
                      handleNameChange(value, item, index);
                      handleGroupChange(value,item, index);}}
                      defaultValue={item.name} 
                      style={{ width: 200 }}
                      renderInput={(params) => <TextField {...params} label="Select Staff"
                      margin="normal" />}
                    />
                </TableCell>
                <TableCell>
                    <Autocomplete
                      id="selectedRole"
                      name="Role"
                      options={roleOption}
                      defaultValue={item.role}
                      onChange={(event, value) => {
                      handleRoleChange(value, item, index);
                      }}
                      style={{ width: 200 }}
                      renderInput={(params) => <TextField {...params} label="Select a Role" margin="normal" />}
                    />
                </TableCell>
                <TableCell>    
                  <TextField
                      name="Group"
                      value={item.workgroup}    
                      style={{ width: 200, paddingLeft: 10 }} 
                    />
                    </TableCell>
                <TableCell>
                    <DeleteIcon
                     color="secondary"
                      onClick={(event) => {
                        handleRemoveRow(index);
                      }}/>
                  </TableCell>
              </TableRow>
              ))}
              </TableBody>
            </Table>
            <PersonAddIcon
            color="secondary"
            onClick={handleAddRow}/>
          </form>
        </div>
      </Card>
    </Container>
  </Page>
  );
}
export default ProjectTeamTable; 