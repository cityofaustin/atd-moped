import React from 'react';
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Grid, Icon } from "@material-ui/core";
import { Breadcrumb } from "matx";
import Select from "react-select";

const NewProject = () => {
  const { register, handleSubmit, setValue, control } = useForm();

  const onSubmit = data => {
    console.log(data)
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
        rules={{ required: true }}
        />
       </Grid>
       </Grid>

       <Grid container spacing={2}>
       <Grid item xs={6}>
        <label className="checkLabel">
        <input type="checkbox" name="Capital Funded" ref={register} className="check" />
        Capitally Funded
        </label>
      </Grid>

      <Grid item xs={6}>
        <TextField 
          inputRef={register} 
          label="e Capris Id" 
          name="e Capris Id"
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