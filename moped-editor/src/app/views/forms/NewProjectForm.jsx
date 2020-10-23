import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TextField, Button, Grid, Icon, InputLabel, MenuItem, Select } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { gql, useMutation, useQuery } from "@apollo/client";

  const NewProjectForm = ({ formContent }) => {
  const methods = useFormContext();
  const { register, setValue, reset, control } = methods;
 
  useEffect(() => {
    reset({ ...formContent.one }, { errors: true });
  }, []);

  const addNewProject = gql `
mutation MyMutation($project_name: String!="", $project_description: String!="", $current_phase: String!="", $current_status: String!="", $eCapris_id: String!="", $fiscal_year: String!="", $start_date: date!="", $capitally_funded: Boolean!="", $project_priority: Int!="") {
  insert_moped_project(objects: {project_name: $project_name, project_description: $project_description, current_phase: $current_phase, current_status: $current_status, eCapris_id: $eCapris_id, fiscal_year: $fiscal_year, start_date: $start_date, capitally_funded: $capitally_funded, project_priority: $project_priority  }) {
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
  const sendData = (data) => {
    let project_name=data.newProject;
    let project_description=data.ProjDesc;
    let eCapris_id=data.eCaprisId;
    let capitally_funded=data.capitalFunded;
    let start_date=data.date;
    let current_phase=data.Phase;
    let project_priority=data.Priority;
    let current_status=data.Status;
    let fiscal_year=data.FiscalYear;
    addProject({variables: {project_name, project_description, eCapris_id, current_phase, current_status, fiscal_year, start_date, capitally_funded, project_priority}});  
  }
 
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

  // let yearOption = [];
  // fiscal.moped_city_fiscal_years.forEach((fiscal) => yearOption.push(fiscal.fiscal_year_value));

  return (
    <form style={{padding: 10}}>
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
      {/* <Autocomplete
              options={yearOption}
              style={{ width: 150 }}
              renderInput={(params) => <TextField {...params} label="Select Fiscal Year" inputRef={register} name="FiscalYear" 
              margin="normal" />} 
            /> */}
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
         
      </Grid> 
    </form>
  );
};

export default NewProjectForm;