import React from 'react';
import { useForm, Controller } from "react-hook-form";
import { Button, Grid, Icon } from "@material-ui/core";
import { Breadcrumb } from "matx";
import { gql, useQuery } from "@apollo/client";
import Select from 'react-select';


const GetData = () => {
  const { handleSubmit, control } = useForm();

const MY_QUERY_QUERY = gql`
  query MyQuery {
    moped_project(order_by: {project_id: asc}) {
      project_id
      current_phase
      current_status
      fiscal_year
    }
  }
`;

  const { loading, error, data } = useQuery(MY_QUERY_QUERY);  
 if (loading) {
  return <div>Loading...</div>;
}
if (error) {
  console.error(error);
  return <div>Error!</div>;
}

  const onSubmit = (info) => {
  console.log(JSON.stringify(info.Projects.value));
  
 };

return (
  <div>
      <Breadcrumb
            routeSegments={[
              { name: "Forms", path: "/getData" },
              { name: "Get Data" }
            ]}
          /> 

<pre>{JSON.stringify(data, null, 2)}</pre>
                
     <form onSubmit={handleSubmit(onSubmit)}
        style={{
          padding: 40,
          margin: 80,
          backgroundColor:"grey"
          }}>
      <h4>Select Project by Project Id</h4>
      <Grid container spacing={2}>
      <Grid item xs={6}>

      <Grid item xs={6}>
      <Controller
        label="Projects"
        placeholder="Projects"
        defaultValue="Project 1"
        name="Projects"
        required
        as={Select}
        options={[
          { value: 1, label: "project 1" },
          { value: 2, label: "project 2" },
          { value: 3, label: "project 3" }
        ]}
        control={control}
        rules={{ required: true }}
        isClearable
        closeMenuOnSelect={true}
        />
       </Grid>
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
);
}

export default GetData;