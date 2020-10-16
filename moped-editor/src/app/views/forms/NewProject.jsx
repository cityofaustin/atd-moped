import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TextField, Button, Grid, Icon, InputLabel, MenuItem, Select } from "@material-ui/core";
import { Breadcrumb } from "matx";
import { gql, useMutation, useQuery } from "@apollo/client";

const NewProject = ({ formContent }) => {
  const methods = useFormContext();
  const { register, handleSubmit, setValue, control } = methods;

  // useEffect(() => {
  //   reset({ ...formContent.one }, { errors: true });
  // }, []);

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
  mutation MyMutation($project_name: String!="", $project_description: String!="", $current_phase: String!="", $project_priority: Int!="", $current_status: String!="", $eCapris_id: bpchar!="", $fiscal_year: String!="", $capitally_funded: Boolean!="", $start_date: date="") {
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
   
    <div>
          <Breadcrumb
            routeSegments={[
              { name: "Forms", path: "/new-project" },
              { name: "New Project" }
            ]}
          />  
    <form onSubmit={handleSubmit(onSubmit)}
        style={{padding: 10}}>
      <h4>Add A Project</h4>
      <Grid container spacing={2}>

      <Grid item xs={6}> 
        <TextField 
          inputRef={register} 
          label="Project Name" 
          name="newProject"
          required="true"
          variant="standard"
        />
      </Grid>
       
      <Grid item xs={6}>
        <TextField 
          inputRef={register} 
          label="Project Description" 
          name="ProjDesc"
          required="true"
          multiline="true"
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
          required="true"
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
  </div>     
  )
}


export default NewProject;

