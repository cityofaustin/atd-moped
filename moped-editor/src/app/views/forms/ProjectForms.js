import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TextField, Button, Grid, Icon, InputLabel, MenuItem, Select } from "@material-ui/core";
import { gql, useMutation, useQuery } from "@apollo/client";
// import MaterialTable from 'material-table';
// import { forwardRef } from 'react';
// import {AddBox, ArrowDownward, Check, ChevronLeft, ChevronRight, DeleteOutline, Clear, Edit, FilterList, FirstPage, LastPage, Remove, SaveAlt, Search, ViewColumn }from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';

export const FormOne = ({ formContent }) => {
  const methods = useFormContext();
  const { register, handleSubmit, setValue, reset, control } = methods;
 

  useEffect(() => {
    reset({ ...formContent.one }, { errors: true });
  }, []);

  const PHASES_QUERY = gql`
  query Phases {
    moped_phases(order_by: {phase_name: asc}) {
      phase_name
    }
  }
`;

const STATUS_QUERY = gql`
  query Status {
    moped_status(order_by: {status_name: asc}) {
      status_name
    }
  }
`;

const FISCAL_QUERY = gql`
  query Fiscal {
    moped_city_fiscal_years(order_by: {fiscal_year_value: asc}) {
      fiscal_year_value
    }
  }
`;

const PRIORITY_QUERY = gql`
  query Priority {
    moped_proj_phases(order_by: {phase_priority: asc}) {
      phase_priority
    }
  }
`;

  const addNewProject = gql `
  mutation MyMutation($project_name: String!="", $project_description: String!="", $current_phase: String!="", $project_priority: Int!="", $current_status: String!="", $eCapris_id: String!="", $fiscal_year: String!="", $capitally_funded: Boolean!="", $start_date: date="") {
    insert_moped_project(objects: {project_name: $project_name, project_description: $project_description, project_priority: $project_priority, current_phase: $current_phase, current_status: $current_status, eCapris_id: $eCapris_id, fiscal_year: $fiscal_year, capitally_funded: $capitally_funded, start_date: $start_date }) {
      affected_rows
      returning {
        project_name
        project_description
        project_priority
        current_phase
        current_status
        eCapris_id
        fiscal_year
        capitally_funded
        start_date
      }
    }
  }    
 `;

  const [addProject] = useMutation(addNewProject);
   
  const onSubmit = (data, e) => {
    e.target.reset(data); // reset after form submit
    let project_name=data.newProject;
    let project_description=data.ProjDesc;
    let eCapris_id=data.eCaprisId;
    let capitally_funded=data.capitalFunded;
    let start_date=data.date;
    let current_phase=data.Phase;
    let project_priority=data.Priority;
    let current_status=data.Status;
    let fiscal_year=data.FiscalYear;
    addProject({variables: {project_name, project_description, eCapris_id, current_phase, current_status, project_priority, fiscal_year, capitally_funded, start_date}});    
  };

  const handleChange = (e) => {
    setValue("date", e.target.value);
  }

  React.useEffect(() => {
    register("date"); // custom register date input
  }, [register])

  const { loading: phaseLoading, error: phaseError, data: phases, onPhaseSelected} = useQuery(PHASES_QUERY);

  const { loading: statusLoading, error: statusError, data: statuses, onStatusSelected} = useQuery(STATUS_QUERY);

  const { loading: fiscalLoading, error: fiscalError, data: fiscal, onFiscalSelected} = useQuery(FISCAL_QUERY);

  const { loading: priorityLoading, error: priorityError, data: priorities, onPrioritySelected} = useQuery(PRIORITY_QUERY);

  if (phaseLoading) return 'Loading...';
  if (phaseError) return `Error! ${phaseError.message}`;

  if (statusLoading) return 'Loading...';
  if (statusError) return `Error! ${statusError.message}`;

  if (fiscalLoading) return 'Loading...';
  if (fiscalError) return `Error! ${fiscalError.message}`;

  if (priorityLoading) return 'Loading...';
  if (priorityError) return `Error! ${priorityError.message}`;

  return (
    <form onSubmit={handleSubmit(onSubmit)}
        style={{padding: 10}}>
      <h4>Add A Project</h4>
      <Grid container spacing={2}>

      <Grid item xs={6}> 
        <TextField 
          inputRef={register} 
          label="Project Name" 
          name="newProject"
          variant="standard"
        />
      </Grid>
       
      <Grid item xs={6}>
        <TextField 
          inputRef={register} 
          label="Project Description" 
          name="ProjDesc"
          multiline={true}
          variant="standard"
        />
      </Grid>
            
      <Grid item xs={6}>
        <TextField
          inputRef={register} 
          name="date"
          label="Start Date"
          type="date"
          variant="standard"
          defaultValue="2020-01-01"
          onChange={handleChange}
          InputLabelProps={{
        shrink: true,
        }}
        />
      </Grid>
      </Grid>

      <Grid container spacing={2}>
      <Grid item  xs={6}>
        <InputLabel>Fiscal Year
        <Controller
          as={<Select 
            ref={register}
            name="FiscalYear" 
            onChange= {onFiscalSelected}>
            {fiscal.moped_city_fiscal_years.map(fiscal => (
              <MenuItem 
                key={fiscal.fiscal_year_value} 
                value={fiscal.fiscal_year_value}>
                {fiscal.fiscal_year_value}
              </MenuItem>
            ))}
          </Select>}
            name="FiscalYear"
            defaultValue=""
            control={control}
          />
        </InputLabel>
      </Grid>

      <Grid item xs={6}>
        <InputLabel>Current Status
        <Controller 
          as={<Select 
            name="Status"  
            ref={register} 
            onChange= {onStatusSelected}>
            {statuses.moped_status.map(status => (
              <MenuItem key={status.status_name} value={status.status_name}>
              {status.status_name}
              </MenuItem>
            ))}
          </Select>}
          name="Status"
          defaultValue=""
          control={control}
          />
        </InputLabel> 
      </Grid>
       
      <Grid item xs={6}>
        <InputLabel>Current Phase 
        <Controller
          as={<Select 
            name="Phase"  
            ref={register} 
            onChange= {onPhaseSelected}>
            {phases.moped_phases.map(phase => (
              <MenuItem 
                key={phase.phase_name} 
                value={phase.phase_name}>
                {phase.phase_name}
              </MenuItem>
            ))}
          </Select>}
          name="Phase"
          defaultValue=""
          control={control}
          />
        </InputLabel>   
      </Grid>
      
     <Grid item xs={6}>
        <InputLabel>Priority 
        <Controller
         as={<Select 
            name="Priority" 
            ref={register} 
            onChange= {onPrioritySelected}>
            {priorities.moped_proj_phases.map(priority => (
              <MenuItem 
                key={priority.phase_priority} 
                value={priority.phase_priority}>
                {priority.phase_priority}
              </MenuItem>
            ))}
          </Select>}
          name="Priority"
          defaultValue=""
          control={control}
          /> 
        </InputLabel> 
      </Grid>
      </Grid> 

      <Grid container spacing={2}>
      <Grid item xs={6}>
        <InputLabel>
          <input 
            type="checkbox" 
            name="capitalFunded" 
            ref={register} 
            />
            Capitally Funded
        </InputLabel>
      </Grid>

      <Grid item xs={6}>
        <TextField 
          inputRef={register} 
          label="e Capris Id" 
          name="eCaprisId"
          variant="standard"
          />
      </Grid>
       
      <Grid item xs={6}>
        <Button 
          color="primary" 
          variant="contained" 
          type="submit">
        <Icon>send</Icon>
        <span className="pl-2 capitalize">Submit</span>
        </Button>
      </Grid>   
      </Grid> 
    </form>
  );
};

export const FormTwo = ({ formContent }) => {

  // export const FormTwo = ({ formContent }, {last_name}) => { this is also for the GROUP_QUERY adding the variable last_name

    const methods = useFormContext();
    const { reset, register, control, handleSubmit } = methods;
    
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
    let first_name=data.First;
    let last_name=data.Last;
    let workgroup=data.Group;
    let role_name=data.Role; 
    addStaff({variables: {workgroup, role_name, first_name, last_name}});    
  }; 
  
    const ROLES_QUERY = gql`
    query Roles {
      moped_project_roles(order_by: {project_role_name: asc}) {
        project_role_name
      }
    }
  `;
  
  const MEMBERS_QUERY = gql`
    query Members {
      moped_proj_personnel(order_by: {last_name: asc}) {
        full_name
        first_name
        last_name
        workgroup
      }
    }
  `;
  //this code below is taken from apollo docs and is all for trying to get the workgroup to populate automatically upon user selecting from name dropdown menu.It isn't working
  
  // const GROUP_QUERY = gql`
  // query Group($last_name: String) {
  //   moped_proj_personnel(where: {last_name: {_eq: $last_name}}) {
  //     workgroup
  //   }
  // }
  // `;
  // const { loading: groupLoading, error: groupError,
  //   data: group} = useQuery(GROUP_QUERY, {variables: { last_name },});
  
  const { loading: roleLoading, error: roleError, data: roles, onRoleSelected } = useQuery(ROLES_QUERY);
  
  const { loading: membersLoading, error: membersError, data: members, onMemberSelected }  = useQuery(MEMBERS_QUERY);
  
  // const { loading: groupLoading, error: groupError,
  //   data: group} = useQuery(GROUP_QUERY);
   
  if (roleLoading) return 'Loading...';
  if (roleError) return `Error! ${roleError.message}`;
  
  if (membersLoading) return 'Loading...';
  if (membersError) return `Error! ${membersError.message}`;
  
  // if (groupLoading) return 'Loading...';
  // if (groupError) return `Error! ${groupError.message}`;
  
  return (
  <div>
     <form onSubmit={handleSubmit(onSubmit)}style={{padding: 10}}>    
     <Table className={classes.table}>
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
        <TableRow id="addr" key={index}>
         <TableCell>{item.id}</TableCell>
       <TableCell> 
         <Controller 
         as={<Select 
               ref={register}
               name="Name" //need inside select for query
               onChange= {onMemberSelected}>
               {members.moped_proj_personnel.map(Name => (
                 <MenuItem 
                   key={Name.last_name} 
                   value={Name.last_name}>
                   {Name.first_name}{Name.last_name}  
                 </MenuItem>
               ))}             
             </Select>}
             name="Name" //need out of select but inside controller for mutation
             defaultValue=""// need for stepper
             control={control} //needs to be outside select
             />
         </TableCell>
         <TableCell> 
           <Controller 
             as={<Select
               ref={register} 
               name="Group"
               onChange={onMemberSelected}>
               {members.moped_proj_personnel.map(Group => (
                 <MenuItem 
                   key={Group.workgroup} 
                   value={Group.workgroup}>
                   {Group.workgroup}
                 </MenuItem>
               ))}             
             </Select>}
             name="Group"
             defaultValue=""
             control={control}
             />
         </TableCell>
         <TableCell> 
           <Controller 
             as={<Select 
               ref={register}
               name="Role" 
               onChange= {onRoleSelected}> 
               {roles.moped_project_roles.map(role => (
                 <MenuItem 
                   key={role.project_role_name} 
                   value={role.project_role_name}>
                   {role.project_role_name}
                 </MenuItem>             
               ))}              
             </Select>}
               name="Role"
               defaultValue=""
               control={control}
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
        <Button 
          color="secondary"
          onClick={handleAddRow}>
          <Icon>person_add</Icon>
        </Button> 
    </TableBody>
  </Table> 
    <Button 
        color="primary" 
        variant="contained" 
        type="submit">
        <Icon>send</Icon>
        <span className="pl-2 capitalize">Submit</span>
    </Button>
  </form>   
</div>
);
}

export const FormThree = ({ formContent }) => {
  const methods = useFormContext();
  const { reset } = methods;
  // const { useState } = React;

  useEffect(() => {
    reset({ ...formContent.three }, { errors: true });
  }, []);





  // const tableIcons = {
  //   Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  //   Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  //   Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  //   Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  //   DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  //   Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  //   Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  //   Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  //   FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  //   LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  //   NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  //   PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  //   ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  //   Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  //   SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  //   ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  //   ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
  // };

  // const [columns, setColumns] = useState([
  //   { 
  //     title: 'Name', 
  //     field: 'name', 
  //     tableRef:{register},
  //     ref: {register},
  //     initialEditValue: '', 
  //    },
  //   { 
  //     title: 'Role', 
  //     field: 'Role', 
  //     tableRef:{register},
  //     ref: {register},
  //     lookup: {
  //     1: 'Owner', 
  //     2: 'Team Member', 
  //     3: 'Executive Sponsor'}    
  //    },
  //   { 
  //     title: 'Work Group', 
  //     field: 'WorkGroup', 
  //     tableRef:{register},
  //     ref: {register},
  //     lookup: { 1: 'Signals', 2: 'Division', 3: 'Manager'}
  //   },
  //   {
  //     title: 'Division',
  //     field: 'Division',
  //     tableRef: {register},
  //     ref: {register},
  //     lookup: { 1: 'Arterial Management', 2: 'Choice 2' }
  //   },
  // ]);

  // const [data, setData] = useState([
  //   { name: 'Renee Orr', role: 1, workgroup: 2, division: 1 },
  //   { name: 'Judith Olvera', role: 2, workgroup: 3, division: 1 },
  //   { name: 'Scott Feldman', role: 3, workgroup: 1, division: 1 },
  //   { name: 'Jen Duthie', role: 2, workgroup: 1, division: 1 },
  // ]);

  // const onSubmit = (data, e) => {
  //   console.log(data);
  // }
 
  // return (
  //   <div>
       
    {/* <MaterialTable
    title="Assign Team Members"
    icons={tableIcons}
    columns={columns}
    data={data}
    editable={{
      onRowAdd: newData =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            setData([...data, newData]);
            
            resolve();
          }, 1000)
        }),
      onRowUpdate: (newData, oldData) =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            const dataUpdate = [...data];
            const index = oldData.tableData.id;
            dataUpdate[index] = newData;
            setData([...dataUpdate]);
            resolve();
          }, 1000)
        }),
      onRowDelete: oldData =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            const dataDelete = [...data];
            const index = oldData.tableData.id;
            dataDelete.splice(index, 1);
            setData([...dataDelete]);
            
            resolve()
          }, 1000)
        }),
    }}
  />
  <Button 
          color="primary" 
          variant="contained" 
          type="submit">
        <Icon>send</Icon>
        <span className="pl-2 capitalize">Submit</span>
        </Button> */}
  //       </div>
  // );
};

