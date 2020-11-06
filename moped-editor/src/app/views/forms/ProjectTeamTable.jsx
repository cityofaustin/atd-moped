import React, { useState } from "react";
import { TextField, Button, Icon } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { gql, useQuery } from "@apollo/client";
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
 

const ProjectTeamTable = ( props ) => {
  const useStyles = makeStyles({
    table: {
      minWidth: 650,
      margin: 20
    },
  });
  const classes = useStyles();
  
  const handleAddRow = () => {
    let item = {
      id: props.rows.length + 1,
      name: '',
      workgroup: '',
      role: ''
    };
    props.setRows(rows => [...rows, item]);
  };

  const handleRemoveRow = (index) => {
    if(props.rows.length > 1) props.setRows(props.rows.slice(0, index));
  };

  const handleNameChange = (value, item, index) => {
    console.log(item);
    item.name = value.name; 
    item.workgroup = value.workgroup; 
    props.setRows(props.rows);
    console.log(props.rows);
  };

  const handleRoleChange = (value, item, index) => {
    item.role = value;
    props.setRows(props.rows);
  };


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
         {props.rows.map((item, index) => (
          <TableRow key={index}>
           <TableCell>{item.id}</TableCell>
           <TableCell>
             <Autocomplete 
                id="selectedName"
                name="Name"
                options={nameOption}
                getOptionLabel={(option) => option.name ? option.name : ""}
                onChange = {(event, value) => {
                handleNameChange(value, item, index);}}
                defaultValue={item.name.name} 
                style={{ width: 150 }}
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
                style={{ width: 150 }}
                renderInput={(params) => <TextField {...params} label="Select a Role" margin="normal" />}
              />
           </TableCell>
           {/* <TableCell>{item.workgroup}</TableCell> */}
           <TableCell>    
             <TextField
                value={item.workgroup}    
                style={{ width: 150, paddingLeft: 10 }} 
              />
              </TableCell>
           <TableCell>
              <Button
                color="secondary"
                onClick={(event) => {
                  handleRemoveRow(index);
                }}>
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

// import React, { useEffect, useState } from "react";
// import { useFormContext, Controller } from "react-hook-form";
// import { TextField, Button, Icon } from "@material-ui/core";
// import Autocomplete from "@material-ui/lab/Autocomplete";
// import { gql, useQuery } from "@apollo/client";
// import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
// import { DevTool } from "@hookform/devtools";

// const ProjectTeamTable = ({ formContent }) => {
//   const methods = useFormContext();
//   const { reset, register, control, getValues } = methods;
//   useEffect(() => {
//     reset({ ...formContent.two }, { errors: true });
//   }, []);

//   const defaultRow = [{
//     id: 1,
//     Name: '',
//     Group: '',
//     Role: ''
//   }];

//   // easy way to get values of inputs if needed
//   let nameValue = getValues("Last");
//   let roleValue = getValues("Role");
//   let groupValue = getValues("Group");

//   const [userInput, setUserInput] = useState(nameValue);

//   const saveRow = (input) => {
//   setUserInput(input);
//   }


//   const [rows, setRows] = useState(defaultRow);
    
//   const handleAddRow = () => {
//     let item = [{
//       id: rows.length + 1,
//       Name: '',
//       Group: '',
//       Role: ''
//     }];   
//     setRows([...rows, item]);
//   };

//   const handleRemoveRow = () => {
//     if(rows.length > 1)
//     setRows(rows.slice(0, -1));
//   } 

//   const MEMBERS_QUERY = gql`
//     query Members {
//       moped_coa_staff(order_by: {last_name: asc}) {
//         full_name
//         first_name
//         last_name
//         workgroup
//       }
//     }
//   `;

//   const ROLES_QUERY = gql`
//   query Roles {
//     moped_project_roles(order_by: {project_role_name: asc}) {
//       project_role_name
//     }
//   }
// `;

// const { loading: membersLoading, error: membersError, data: members }  = useQuery(MEMBERS_QUERY);

// const { loading: roleLoading, error: roleError, data: roles } = useQuery(ROLES_QUERY);

// if (membersLoading) return 'Loading...';
// if (membersError) return `Error! ${membersError.message}`;
 
// if (roleLoading) return 'Loading...';
// if (roleError) return `Error! ${roleError.message}`;

// let nameOption = [];
// members.moped_coa_staff.forEach((name) => 
// nameOption.push(name.last_name));

// const handleSetGroup = () => {
//   let input = document.getElementById("selectedGroup");
//   input.value=members.moped_coa_staff.workgroup;
// }

// let roleOption = [];
// roles.moped_project_roles.forEach((role) => roleOption.push(role.project_role_name));
        
// return (
//   <div>
//     <form style={{padding: 10}}>   
//     <DevTool control={control} /> 
//      <Table>
//      <TableHead>
//        <TableRow>
//          <TableCell>Row</TableCell>
//          <TableCell>Name</TableCell>
//          <TableCell>Role</TableCell>
//          <TableCell>WorkGroup</TableCell> 
//        </TableRow>
//      </TableHead>
//      <TableBody>
//        {rows.map((item, index) => (
//         <TableRow id="add" key={index}>
//          <TableCell>{item.id}</TableCell>
//          <TableCell> 
//            <Autocomplete
//               id="selectedName"
//               value={userInput}
//               ref={register}
//               name="Last"
//               onChange={handleSetGroup}
//               options={nameOption}
//               style={{ width: 150 }}
//               renderInput={(params) => <TextField {...params} label="Select Staff" inputRef={register} name="Last"  
//               margin="normal" />}
//              />      
//          </TableCell>
//          <TableCell>
//             <Autocomplete
//               id="selectedRole"
//               name="Role"
              
//               ref={register}
//               options={roleOption}
//               autoComplete="off"
//               style={{ width: 150 }}
//               renderInput={(params) => <TextField {...params} label="Select a Role"  inputRef={register} name="Role" margin="normal" />} 
//             />
//          </TableCell>  
//          <TableCell> 
//                 <TextField
//                 id="selectedGroup"
                
//                 inputRef={register}
//                 name="Group"     
//                 style={{ width: 150, paddingLeft: 10 }} 
//               />
//          </TableCell> 
//          <TableCell>
//             <Button
//               color="secondary"
//               onClick={saveRow}>
//               <Icon>save</Icon>
//             </Button>  
//           </TableCell> 
//          <TableCell>
//             <Button
//               color="secondary"
//               onClick={handleRemoveRow}>
//               <Icon>delete</Icon>
//             </Button>  
//           </TableCell>
//       </TableRow> 
//       ))}   
//       </TableBody>   
//     </Table> 
//     <Button
//       color="secondary"
//       onClick={handleAddRow}>
//     <Icon>person_add</Icon> 
//     </Button>  
//   </form>
// </div>
// );
// }
  
// export default ProjectTeamTable;