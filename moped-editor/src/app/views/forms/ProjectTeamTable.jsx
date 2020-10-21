import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { TextField, Button, Icon } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { gql, useMutation, useQuery } from "@apollo/client";
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';

const ProjectTeamTable = ({ formContent }) => {
  const methods = useFormContext();
  const { reset, register, handleSubmit } = methods;
  useEffect(() => {
    reset({ ...formContent.two }, { errors: true });
  }, []);

  const useStyles = makeStyles({
    table: {
      minWidth: 650,
      margin: 20
    },
  });
  const classes = useStyles();

  const defaultRow = [{
    id: 1,
    Name: '',
    Group: '',
    Role: ''
  }];

  const [rows, setRows] = useState(defaultRow);
    
  const handleAddRow = () => {
    let item = {
      id: rows.length + 1,
      Name: '',
      Group: '',
      Role: ''
    };
    setRows([...rows, item]);
  };

  const handleRemoveRow = () => {
    if(rows.length > 1)
    setRows(rows.slice(0, -1));
  };

  const TEAMS_MUTATION = gql`
    mutation Teams ($workgroup: String!="", $role_name: String!="", $first_name: String!="", $last_name: String!="") {
      insert_moped_proj_personnel(objects: {workgroup: $workgroup, role_name: $role_name, first_name: $first_name, last_name: $last_name}) {
        affected_rows
        returning {
          workgroup
          role_name
          first_name
          last_name
        }
      }
    }
  `; 

  const [addStaff] = useMutation(TEAMS_MUTATION);
   
  const onSubmit = (data) => {
    let last_name=data.Last;
    let workgroup=data.Group;
    let role_name=data.Role; 
    addStaff({variables: {workgroup, role_name, last_name}});    
  }; 
  
  const MEMBERS_QUERY = gql`
    query Members {
      moped_coa_staff(order_by: {last_name: asc}) {
        full_name
        first_name
        last_name
        workgroup
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
members.moped_coa_staff.forEach((name) => nameOption.push(name.last_name));

let groupOption = [];
members.moped_coa_staff.forEach((group) => groupOption.push(group.workgroup));

let roleOption = [];
roles.moped_project_roles.forEach((role) => roleOption.push(role.project_role_name));
          
return (
  <div>
    <form style={{padding: 10}}>   
     <Table className="classes">
     <TableHead>
       <TableRow>
         <TableCell>Row</TableCell>
         <TableCell>Name</TableCell>
         <TableCell>WorkGroup</TableCell>
         <TableCell>Role</TableCell>
       </TableRow>
     </TableHead>
     <TableBody>
       {rows.map((item, index) => (
        <TableRow id="add" key={index}>
         <TableCell>{item.id}</TableCell>
         <TableCell> 
           <Autocomplete
              id="selectedName"
              options={nameOption}
              style={{ width: 150 }}
              renderInput={(params) => <TextField {...params} label="Select Staff" inputRef={register} name="Last" 
              margin="normal" />}  
            />
         </TableCell>
         <TableCell>
            <Autocomplete
              id="selectedRole"
              options={roleOption}
              style={{ width: 150 }}
              renderInput={(params) => <TextField {...params} label="Select a Role"  inputRef={register} name="Role" margin="normal" />} 
            />
         </TableCell> 
         <TableCell> 
            <Autocomplete
              id="selectedGroup"
              options={groupOption}
              style={{ width: 150 }}
              renderInput={(params) => <TextField {...params} label="Select a WorkGroup" inputRef={register} name="Group" margin="normal" />} 
            />
         </TableCell>  
         <TableCell>
            <Button
              color="secondary"
              onClick={handleRemoveRow}>
              <Icon>delete</Icon>
            </Button>  
          </TableCell>
      </TableRow> 
      ))}   
      </TableBody>   
    </Table> 
    <Button
      color="secondary"
      onClick={handleAddRow}>
    <Icon>person_add</Icon> 
    </Button>  
  </form>
</div>
);
}
  
export default ProjectTeamTable;