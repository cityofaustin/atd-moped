import React from 'react';
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Grid, Icon } from "@material-ui/core";
import { Breadcrumb } from "matx";
import Select from "react-select";
import { gql, useMutation } from "@apollo/client";

const NewProject = () => {

  const { register, handleSubmit, setValue, control } = useForm();

  const addNewProject = gql `
  mutation MyMutation($project_name: String!="", $project_description: String!="", $current_phase: String!="", $project_priority: String!="", $current_status: String!="", $eCapris_id: bpchar!="", $fiscal_year: String!="", $capitally_funded: Boolean!="", $start_date: date="") {
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
    let current_phase=JSON.stringify(data.Phase.value);
    let project_priority=JSON.stringify(data.Priority.value);
    let current_status=JSON.stringify(data.Status.value);
    let fiscal_year=JSON.stringify(data.FiscalYear.value);
    addProject({variables: {project_name, project_description, eCapris_id, current_phase, current_status, project_priority, fiscal_year, capitally_funded, start_date}});    
  };

  const handleChange = (e) => {
    setValue("date", e.target.value);
  }

  React.useEffect(() => {
    register("date"); // custom register date input
  }, [register])

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
        setValue={setValue}
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
        <Controller
        label="Fiscal Year"
        placeholder="Fiscal Year"
        defaultValue="2020-21"
        className="selects"
        name="FiscalYear"
        required
        as={Select}
        options={[
          { value: "2020-21", label: "2020-21" },
          { value: "2021-22", label: "2021-22" },
          { value: "2022-23", label: "2022-23" }
        ]}
        control={control}
        isClearable
        rules={{ required: true }} 
        />
      </Grid>

      <Grid item xs={6}>
        <Controller
        label="Status"
        placeholder="Current Status"
        defaultValue="Active"
        className="selects"
        name="Status"
        required
        as={Select}
        options={[
          { value: "Active", label: "Active" },
          { value: "InProgress", label: "In Progress" },
          { value: "Complete", label: "Complete" }
        ]}
        control={control}
        isClearable
        rules={{ required: true }}
        />
      </Grid>
       
      <Grid item xs={6}>
         <Controller
        label="Phase"
        placeholder=" Current Phase"
        defaultValue="Design"
        className="selects"
        name="Phase"
        required
        as={Select}
        options={[
          { value: "Design", label: "Design" },
          { value: "Construction", label: "Construction" },
          { value: "Complete", label: "Complete" }
        ]}
        control={control}
        isClearable
        rules={{ required: true }}
        />
      </Grid>
      
      <Grid item xs={6}>
      <Controller
        label="Priority"
        className="selects"
        placeholder="Priority"
        defaultValue="Medium"
        name="Priority"
        required
        as={Select}
        options={[
          { value: "Low", label: "Low" },
          { value: "Medium", label: "Medium" },
          { value: "High", label: "High" }
        ]}
        control={control}
        isClearable
        rules={{ required: true }}
        />
       </Grid>
       </Grid>

       <Grid container spacing={2}>
       <Grid item xs={6}>
        <label className="checkLabel">
        <input type="checkbox" name="capitalFunded" ref={register} className="check" />
        Capitally Funded
        </label>
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
        <Button color="primary" variant="contained" type="submit">
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